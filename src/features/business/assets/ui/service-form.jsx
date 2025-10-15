import React, { forwardRef, useState, useRef, useEffect, useCallback } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { Calendar3, Plus } from 'react-bootstrap-icons';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import clsx from 'clsx';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputNumber } from 'primereact/inputnumber';
import { InputTextarea } from 'primereact/inputtextarea';
import * as yup from 'yup';
import styles from './vehicle-form.module.scss';
import { getListOfExpense } from '../../../../APIs/expenses-api';
import exclamationCircle from "../../../../assets/images/icon/exclamation-circle.svg";
import NewExpensesCreate from '../../../../components/Business/features/expenses-features/new-expenses-create/new-expense-create';

const schema = yup.object({
    expense: yup.number()
        .required("Expense is required")
        .nullable(),
    odometer_km: yup.number()
        .required("Odometer reading is required")
        .min(0, "Odometer cannot be negative")
        .max(2147483647, "Odometer value is too large"),
    date: yup.date()
        .required("Date is required")
        .nullable(),
    upcoming_date: yup.date()
        .nullable()
        .min(yup.ref('date'), "Upcoming date must be after service date"),
    cost: yup.number()
        .required("Cost is required")
        .min(0, "Cost cannot be negative"),
    notes: yup.string()
        .max(500, "Notes must be at most 500 characters"),
});

const ServiceForm = forwardRef(({ onSubmit, defaultValues }, ref) => {
    const [showCreateExpenseModal, setShowCreateExpenseModal] = useState(false);
    const [expenseRefetch, setExpenseRefetch] = useState(false);
    const [expenses, setExpenses] = useState([]);
    console.log('expenses: ', expenses);
    const [expenseValue, setExpenseValue] = useState(defaultValues?.expense || '');
    const [hasMoreExpenses, setHasMoreExpenses] = useState(true);
    const [loadingExpenses, setLoadingExpenses] = useState(false);
    const [expenseSearchQuery, setExpenseSearchQuery] = useState('');
    const expensePageRef = useRef(1);
    const dropdownRef = useRef(null);
    const searchTimeoutRef = useRef(null);

    const { control, register, handleSubmit, setValue, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            odometer_km: 0,
            cost: 0,
            ...defaultValues
        }
    });

    // Fetch expenses with pagination and search
    const fetchExpenses = useCallback(async (page = 1, resetList = false, searchQuery = '') => {
        if (loadingExpenses) return;
        
        setLoadingExpenses(true);
        try {
            const data = await getListOfExpense(page, 25, searchQuery, '', false, {});
            const newExpenses = data?.results || [];
            
            if (resetList) {
                setExpenses(newExpenses);
                expensePageRef.current = 1;
            } else {
                // Filter out duplicates using Set for O(1) lookup
                setExpenses(prev => {
                    const existingExpenseIds = new Set(prev.map(expense => expense.id));
                    const uniqueNewExpenses = newExpenses.filter(expense => !existingExpenseIds.has(expense.id));
                    return [...prev, ...uniqueNewExpenses];
                });
            }
            
            setHasMoreExpenses(newExpenses.length === 25);
        } catch (error) {
            console.error('Error fetching expenses:', error);
        } finally {
            setLoadingExpenses(false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Reset page when search changes
    useEffect(() => {
        if (expenseSearchQuery) {
            expensePageRef.current = 1;
        }
    }, [expenseSearchQuery]);

    // Fetch data when page or search changes
    useEffect(() => {
        fetchExpenses(expensePageRef.current, expensePageRef.current === 1, expenseSearchQuery);
    }, [expenseSearchQuery, expenseRefetch, fetchExpenses]);

    // Initial load
    useEffect(() => {
        fetchExpenses(1, true, '');
    }, [fetchExpenses]);

    // Handle scroll for infinite loading
    const handleExpenseScroll = useCallback((e) => {
        const element = e.target;
        const isAtBottom = Math.abs(element.scrollHeight - element.scrollTop - element.clientHeight) < 1;
        
        if (isAtBottom && hasMoreExpenses && !loadingExpenses) {
            const nextPage = expensePageRef.current + 1;
            expensePageRef.current = nextPage;
            fetchExpenses(nextPage, false, expenseSearchQuery);
        }
    }, [hasMoreExpenses, loadingExpenses, fetchExpenses, expenseSearchQuery]);

    return (
        <form ref={ref} onSubmit={handleSubmit(onSubmit)}>
            <Row>
                <Col sm={12}>
                    <h2 className={styles.sectionTitle}>Service Information</h2>
                </Col>
            </Row>

            <Row className={clsx(styles.bgGreay)}>
                <Col sm={6}>
                    <div className="d-flex flex-column gap-1 mb-4">
                        <label className={clsx(styles.lable)}>Expense <span className='required'>*</span></label>
                        <input type="hidden" {...register("expense")} />
                        <Dropdown
                            ref={dropdownRef}
                            value={expenseValue}
                            onChange={(e) => {
                                setExpenseValue(e.value);
                                setValue('expense', +e.value);
                            }}
                            options={expenses}
                            optionLabel="number"
                            optionValue="id"
                            className={clsx(styles.dropdownSelect, { [styles.error]: errors.expense })}
                            panelClassName="expense-dropdown"
                            style={{ height: '46px' }}
                            placeholder="Select an expense"
                            filter
                            onFilter={(e) => {
                                const query = e.filter || '';
                                
                                // Debounce the search query update
                                if (searchTimeoutRef.current) {
                                    clearTimeout(searchTimeoutRef.current);
                                }
                                
                                searchTimeoutRef.current = setTimeout(() => {
                                    setExpenseSearchQuery(query);
                                }, 300);
                            }}
                            filterInputAutoFocus={true}
                            scrollHeight="400px"
                            onShow={() => {
                                // Attach scroll listener when dropdown opens
                                setTimeout(() => {
                                    const panel = document.querySelector('.p-dropdown-items-wrapper');
                                    if (panel) {
                                        panel.addEventListener('scroll', handleExpenseScroll);
                                    }
                                }, 100);
                            }}
                            onHide={() => {
                                // Clear search timeout
                                if (searchTimeoutRef.current) {
                                    clearTimeout(searchTimeoutRef.current);
                                }
                                
                                // Reset search query
                                setExpenseSearchQuery('');
                                
                                // Remove scroll listener when dropdown closes
                                const panel = document.querySelector('.p-dropdown-items-wrapper');
                                if (panel) {
                                    panel.removeEventListener('scroll', handleExpenseScroll);
                                }
                            }}
                            itemTemplate={(option) => (
                                <div className='d-flex flex-column' style={{ padding: '4px 0' }}>
                                    <span style={{ fontWeight: '500', fontSize: '14px', color: '#344054' }}>
                                        {option.number || 'N/A'} {option.invoice_reference && `- ${option.invoice_reference}`}
                                    </span>
                                    <span style={{ fontSize: '12px', color: '#667085' }}>
                                        ${option.total?.toFixed(2) || '0.00'}
                                    </span>
                                </div>
                            )}
                            valueTemplate={(option) => {
                                return (
                                    expenseValue ? (
                                        <span style={{ fontWeight: '500', color: '#344054' }}>
                                            {option.number || 'N/A'} {option.invoice_reference && `- ${option.invoice_reference}`} - ${option.total?.toFixed(2) || '0.00'}
                                        </span>
                                    ) : null
                                );
                            }}
                            emptyFilterMessage="No expenses found"
                        />
                        {errors.expense && <p className="error-message">{errors.expense.message}</p>}
                    </div>
                </Col>

                <Col sm={6}>
                    <div className="d-flex justify-content-center flex-column gap-1 mt-3 pt-3 mb-3">
                        <Button className={styles.expensesCreateNew} onClick={() => setShowCreateExpenseModal(true)}>
                            Create New Expense
                            <Plus size={24} color="#475467" />
                        </Button>
                    </div>
                </Col>

                <Col sm={6}>
                    <div className="d-flex flex-column gap-1 mb-4">
                        <label className={clsx(styles.lable)}>Odometer (km) <span className='required'>*</span></label>
                        <div className={styles.inputGroup}>
                            <Controller
                                name="odometer_km"
                                control={control}
                                render={({ field }) => (
                                    <InputNumber
                                        value={field.value}
                                        onValueChange={(e) => field.onChange(e.value)}
                                        className={clsx(styles.inputText, { [styles.error]: errors.odometer_km }, 'p-0 pe-5')}
                                        placeholder="Enter odometer reading"
                                        useGrouping={false}
                                        min={0}
                                        max={2147483647}
                                    />
                                )}
                            />
                            <span className={styles.unitText}>km</span>
                        </div>
                        {errors.odometer_km && <p className="error-message">{errors.odometer_km.message}</p>}
                    </div>
                </Col>

                <Col sm={6}>
                    <div className="d-flex flex-column gap-1 mb-4">
                        <label className={clsx(styles.lable)}>Cost ($) <span className='required'>*</span></label>
                        <IconField>
                            <Controller
                                name="cost"
                                control={control}
                                render={({ field }) => (
                                    <InputNumber
                                        prefix="$"
                                        value={field.value}
                                        onValueChange={(e) => field.onChange(e.value)}
                                        style={{ height: '46px', padding: '0px' }}
                                        className={clsx(styles.inputText, { [styles.error]: errors.cost })}
                                        placeholder='$ Enter cost'
                                        maxFractionDigits={2}
                                        minFractionDigits={2}
                                        min={0}
                                    />
                                )}
                            />
                            <InputIcon>{errors.cost && <img src={exclamationCircle} className='mb-3' alt="error" />}</InputIcon>
                        </IconField>
                        {errors.cost && <p className="error-message">{errors.cost.message}</p>}
                    </div>
                </Col>

                <Col sm={6}>
                    <div className="d-flex flex-column gap-1 mb-4">
                        <label className={clsx(styles.lable)}>Date <span className='required'>*</span></label>
                        <Controller
                            name="date"
                            control={control}
                            render={({ field }) => (
                                <Calendar
                                    {...field}
                                    value={field.value ? new Date(field.value) : null}
                                    onChange={(e) => field.onChange(e.value)}
                                    showButtonBar
                                    placeholder='DD/MM/YYYY'
                                    dateFormat="dd/mm/yy"
                                    showIcon
                                    style={{ height: '46px' }}
                                    icon={<Calendar3 color='#667085' size={20} />}
                                    className={clsx(styles.inputText, { [styles.error]: errors.date }, 'p-0 outline-none')}
                                />
                            )}
                        />
                        {errors.date && <p className="error-message">{errors.date.message}</p>}
                    </div>
                </Col>

                <Col sm={6}>
                    <div className="d-flex flex-column gap-1 mb-4">
                        <label className={clsx(styles.lable)}>Upcoming Date</label>
                        <Controller
                            name="upcoming_date"
                            control={control}
                            render={({ field }) => (
                                <Calendar
                                    {...field}
                                    value={field.value ? new Date(field.value) : null}
                                    onChange={(e) => field.onChange(e.value)}
                                    showButtonBar
                                    placeholder='DD/MM/YYYY'
                                    dateFormat="dd/mm/yy"
                                    showIcon
                                    style={{ height: '46px' }}
                                    icon={<Calendar3 color='#667085' size={20} />}
                                    className={clsx(styles.inputText, { [styles.error]: errors.upcoming_date }, 'p-0 outline-none')}
                                />
                            )}
                        />
                        {errors.upcoming_date && <p className="error-message">{errors.upcoming_date.message}</p>}
                    </div>
                </Col>

                <Col sm={12}>
                    <div className="d-flex flex-column gap-1 mb-4">
                        <label className={clsx(styles.lable)}>Notes</label>
                        <IconField>
                            <InputIcon>{errors.notes && <img src={exclamationCircle} className='mb-3' alt="error" />}</InputIcon>
                            <InputTextarea
                                {...register("notes")}
                                className={clsx(styles.inputText, { [styles.error]: errors.notes })}
                                placeholder='Enter service notes'
                                rows={4}
                                autoResize
                            />
                        </IconField>
                        {errors.notes && <p className="error-message">{errors.notes.message}</p>}
                    </div>
                </Col>
            </Row>

            {/* Create New Expense Modal */}
            <NewExpensesCreate
                visible={showCreateExpenseModal}
                setVisible={setShowCreateExpenseModal}
                setRefetch={setExpenseRefetch}
            />
        </form>
    );
});

ServiceForm.displayName = 'ServiceForm';

export default ServiceForm;
