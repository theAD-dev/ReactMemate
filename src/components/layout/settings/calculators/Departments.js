import React, { useEffect, useMemo, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { PlusLg, PencilSquare, ChevronDown, ChevronUp, X, PlusCircle, Save, Backspace } from "react-bootstrap-icons";
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Dialog } from 'primereact/dialog';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Skeleton } from 'primereact/skeleton';
import Button from 'react-bootstrap/Button';
import { toast } from 'sonner';
import style from './calculators.module.scss';
import DeleteConfirmationModal from './delete-confirmation-modal';
import { createCalculator, createDepartment, createSubDepartment, getCalculationByReferenceId, getDepartments, updateCalculator, updateDepartment, updateSubDepartment } from '../../../../APIs/CalApi';
import { formatAUD } from '../../../../shared/lib/format-aud';
import { formatMoney } from '../../../Business/shared/utils/helper';
import Sidebar from '../Sidebar';

const Departments = () => {
    const [visible, setVisible] = useState(false);
    const [visible2, setVisible2] = useState(false);
    const [activeTab, setActiveTab] = useState('departments');
    const [editSubIndex, setEdiSubIndex] = useState(null);
    const [createCalculatorId, setCreateCalculatorId] = useState(null);
    const [editDepartment, setEditDepartment] = useState({ id: null, name: null });
    const [subDepartment, setSubDepartment] = useState(null);
    const [activeCalculations, setActiveCalculations] = useState({});

    const [AccordionActiveTab, setAccordionActiveTab] = useState(undefined);
    const [AccordionActiveTab2, setAccordionActiveTab2] = useState(undefined);

    const departmentQuery = useQuery({
        queryKey: ['departments'],
        queryFn: () => getDepartments(1),
        enabled: true,
    });

    const getCalculator = async (subindexId) => {
        const calculation = await getCalculationByReferenceId(subindexId);
        setActiveCalculations((prev) => ({
            ...prev,
            [subindexId]: calculation, // Store calculation data for the specific subindex
        }));
    };

    const handleCreateCalculator = (e, id, i) => {
        e.preventDefault();
        e.stopPropagation();
        setCreateCalculatorId(id);
        setAccordionActiveTab2(i);
        getCalculator(id);
    };

    const editHandleDepartment = (e, data) => {
        e.preventDefault();
        e.stopPropagation();

        setVisible(true);
        setEditDepartment(data);
    };

    const createSubDepartmentOpen = (e, parent, index) => {
        e.preventDefault();
        e.stopPropagation();

        setSubDepartment({ parent });
        setVisible2(true);
        setAccordionActiveTab(index);
    };

    const updateSubDepartment = (e, id, parent, name) => {
        e.preventDefault();
        e.stopPropagation();

        setSubDepartment({ id, parent, name });
        setVisible2(true);
    };

    return (
        <>
            <div className='settings-wrap'>
                <div className="settings-wrapper">
                    <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
                    <div className="settings-content setModalelBoots">
                        <div className='headSticky'>
                            <h1>Calculators</h1>
                        </div>
                        <div className={clsx(style.wraper, `content_wrap_main`)}>
                            <div className='content_wrapper'>
                                <div className="listwrapper">
                                    <div className={`topHeadStyle pb-4 ${style.topHeadBorder}`}>
                                        <h2>Departments</h2>
                                        <button onClick={() => setVisible(true)}>Create Department <PlusLg color="#000000" size={20} className='mb-1 ms-1' /></button>
                                    </div>
                                    <div>
                                        <Accordion
                                            activeIndex={AccordionActiveTab}
                                            onTabChange={(e) => setAccordionActiveTab(e.index)}
                                            expandIcon={<div className='expandIcon'>
                                                <ChevronUp size={16} color='#344054' />
                                            </div>}
                                            collapseIcon={<div className='collapseIcon'>
                                                <ChevronDown size={16} color='#106B99' />
                                            </div>}
                                        >
                                            {
                                                departmentQuery?.data?.filter((data) => !data?.deleted)?.map((department, i) => {
                                                    const subDepartment = department?.subindexes?.filter((data) => !data?.deleted);
                                                    return (
                                                        <AccordionTab
                                                            className={clsx(style.accorHeadbox, 'main-accordion-header')}
                                                            key={department.id}
                                                            header={
                                                                <span className="d-flex align-items-center justify-content-between">
                                                                    <div className='d-flex align-items-center'>
                                                                        <span className={clsx(style.accorHeadStyle, 'active-header-text')}>{department.name}</span>
                                                                        <div className={clsx(style.editIconBox, 'editItem')} onClick={(e) => editHandleDepartment(e, { id: department.id, name: department.name })} style={{ visibility: 'hidden' }}>
                                                                            <PencilSquare color="#106B99" size={16} />
                                                                        </div>
                                                                    </div>
                                                                    <div className={clsx(style.RItem, 'editItem')} style={{ visibility: 'hidden', marginRight: '14px' }}>
                                                                        <DeleteConfirmationModal title={"Department"} api={`/settings/departments/delete/${department.id}/`} refetch={departmentQuery.refetch} />
                                                                        <Button className={style.create} onClick={(e) => createSubDepartmentOpen(e, department.id, i)}><PlusLg color="#106B99" size={18} className='me-2' />Create Sub Department</Button>
                                                                    </div>
                                                                </span>
                                                            }
                                                        >
                                                            <Accordion
                                                                activeIndex={AccordionActiveTab2}
                                                                onTabChange={(e) => setAccordionActiveTab2(e.index)}
                                                                className='innnerAccordian'
                                                                expandIcon={<div className={clsx(style.innerExpandIcon)}>
                                                                    <ChevronUp size={16} color='#344054' />
                                                                </div>}
                                                                collapseIcon={<div className={clsx(style.innerCollapseIcon)}>
                                                                    <ChevronDown size={16} color='#106B99' />
                                                                </div>}
                                                                onTabOpen={(e) => {
                                                                    const subindexId = subDepartment[e.index].id;
                                                                    getCalculator(subindexId);
                                                                }}
                                                                onTabClose={() => {
                                                                    return false;
                                                                }}
                                                            >
                                                                {
                                                                    subDepartment?.map((subindex, i) => (
                                                                        <AccordionTab
                                                                            className={clsx(style.innerBoxStyle, style.innerAccordionTab)}
                                                                            key={subindex.id}
                                                                            header={(
                                                                                <span className="d-flex align-items-center justify-content-between">
                                                                                    <div className='d-flex align-items-center'>
                                                                                        <span className={clsx(style.accorHeadStyle, 'active-header-text')}>{subindex.name}</span>
                                                                                        <div className={clsx(style.editIconBox2, 'editItem')} onClick={(e) => updateSubDepartment(e, subindex.id, department.id, subindex.name)} style={{ visibility: 'hidden' }}>
                                                                                            <PencilSquare color="#106B99" size={16} />
                                                                                        </div>
                                                                                    </div>

                                                                                    <div className={clsx(style.RItem, 'editItem')} style={{ visibility: 'hidden' }}>
                                                                                        <DeleteConfirmationModal title={"Sub Department"} api={`/settings/sub-departments/delete/${subindex.id}/`} refetch={departmentQuery.refetch} />
                                                                                        <Button className={style.create} onClick={(e) => handleCreateCalculator(e, subindex.id, i)}><PlusLg color="#106B99" size={18} className='me-2' />Create Calculator</Button>
                                                                                    </div>
                                                                                </span>
                                                                            )}
                                                                        >
                                                                            {
                                                                                activeCalculations[subindex.id] ? (
                                                                                    <>
                                                                                        {
                                                                                            editSubIndex === subindex.id
                                                                                                ? <EditCalculators editSubIndex={editSubIndex} calculators={activeCalculations[subindex.id]} />
                                                                                                : <ViewCalculators index={subindex.id}
                                                                                                    isNewCreate={createCalculatorId === subindex.id}
                                                                                                    cancelCreateCalculator={setCreateCalculatorId}
                                                                                                    refetch={getCalculator}
                                                                                                    calculators={activeCalculations[subindex.id]}
                                                                                                    name={subindex.name}
                                                                                                />
                                                                                        }
                                                                                    </>
                                                                                ) : <LoadingCalculator />
                                                                            }

                                                                        </AccordionTab>
                                                                    ))
                                                                }
                                                            </Accordion>
                                                        </AccordionTab>
                                                    );
                                                })
                                            }
                                        </Accordion>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <CreateDepartment visible={visible} setVisible={setVisible} refetch={departmentQuery.refetch} editDepartment={editDepartment} setEditDepartment={setEditDepartment} />
            <CreateSubDepartmentModal visible2={visible2} setVisible2={setVisible2} refetch={departmentQuery.refetch} editSubDepartment={subDepartment} setEditSubDepartment={setSubDepartment} />
        </>
    );
};

const calculateSummary = (calculators, taxType) => {
    let budget = 0;
    let subtotal = 0;
    calculators?.forEach(item => {
        let rate = parseFloat(item.cost) || 0;
        let quantity = parseFloat(item.quantity) || 0;
        let cost = rate * quantity;
        budget += parseFloat(cost || 0);
        subtotal += parseFloat(item.total || 0);
    });

    let tax = 0;
    let total = 0;

    if (taxType === 'ex') {
        tax = subtotal * 0.10;
        total = subtotal + tax;
    } else if (taxType === 'in') {
        total = subtotal;
        tax = total * 0.10 / 1.10;
        subtotal = total - tax;
    } else if (taxType === 'no') {
        tax = 0;
        total = subtotal;
    }

    const operationalProfit = subtotal - budget;

    return {
        budget: budget.toFixed(2),
        operationalProfit: operationalProfit.toFixed(2),
        subtotal: subtotal.toFixed(2),
        tax: tax.toFixed(2),
        total: total.toFixed(2),
    };
};

const calculateUnitPrice = (item) => {
    let cost = parseFloat(item?.cost) || 0;
    let unit_price = 0.00;

    let margin = parseFloat(item?.profit_type_value) || 0;
    if (item?.profit_type === "MRK") {
        unit_price = cost + (cost * (margin / 100));
    } else if (item?.profit_type === "MRG") {
        unit_price = cost / (1 - (margin / 100));
    } else if (item?.profit_type === "AMN") {
        unit_price = cost + margin;
    }

    return unit_price.toFixed(2);
};

const ViewSectionComponent = ({ calculator, index, refetch }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [tempCalculator, setTempCalculator] = useState(null);
    const [isEdit, setIsEdit] = useState(false);

    useEffect(() => {
        if (tempCalculator?.profit_type === "MRG") {
            let value = tempCalculator?.profit_type_value || 0.00;
            if (value > 100.00) value = 99.99;
            setTempCalculator((others) => ({ ...others, profit_type_value: value }));
        }
    }, [tempCalculator]);

    const saveCalculator = async () => {
        console.log('tempCalculator: ', tempCalculator);
        let payload = {
            title: tempCalculator?.title,
            description: tempCalculator?.description,
            type: tempCalculator?.type === "Cost" ? 0 : 1,
            cost: tempCalculator?.cost,
            quantity: tempCalculator?.quantity,
            profit_type: tempCalculator?.profit_type,
            profit_type_value: tempCalculator?.profit_type_value,
            total: tempCalculator?.total
        };
        try {
            setIsLoading(true);
            await updateCalculator(index, calculator.id, payload);
            toast.success(`Calculator updated successfully.`);
            setIsEdit(false);
            refetch(index);
        } catch (error) {
            console.log('Error during updating calculator', error);
            toast.error(`Failed to update calculator. Please try again.`);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isEdit && tempCalculator !== calculator) {
            setTempCalculator(calculator);
        }
    }, [isEdit, calculator]);

    useEffect(() => {
        if (isEdit && tempCalculator) {
            let rate = parseFloat(tempCalculator?.cost) || 0;
            let quantity = parseFloat(tempCalculator?.quantity) || 0;
            let subtotal = rate * quantity;

            let margin = parseFloat(tempCalculator?.profit_type_value) || 0;
            if (tempCalculator?.profit_type === "MRK") {
                subtotal += (subtotal * margin) / 100;
            } else if (tempCalculator?.profit_type === "MRG") {
                subtotal = subtotal / (1 - margin / 100);
            } else if (tempCalculator?.profit_type === "AMN") {
                subtotal += margin;
            }

            let discount = parseFloat(tempCalculator?.discount) || 0;
            let total = parseFloat(subtotal - (subtotal * discount) / 100).toFixed(2);

            if (total !== tempCalculator.total) {
                setTempCalculator((others) => ({ ...others, total }));
            }
        }
    }, [tempCalculator, isEdit]);

    return (
        <div className={`${style.contentStyle}`}>
            {
                isEdit ? (
                    <>
                        <h6>Full Description</h6>
                        <InputTextarea autoResize value={tempCalculator?.description}
                            onChange={(e) => setTempCalculator((others) => ({ ...others, description: e.target.value }))}
                            className='w-100 border mb-3' rows={5} style={{ height: '145px', overflow: 'auto', resize: 'none' }} />

                        <Row className={style.edidcodtUpdate}>
                            <Col>
                                <div className={`d-flex gap-2 justify-content-between align-items-center `}>
                                    <div className='left'>
                                        <label>Cost</label>
                                        <InputNumber className={clsx(style.inputNumber)} prefix="$" value={parseFloat(tempCalculator?.cost || 0)}
                                            onValueChange={(e) => setTempCalculator((others) => ({ ...others, cost: e.value }))}
                                            maxFractionDigits={2}
                                            minFractionDigits={2}
                                            inputId="minmaxfraction"
                                        />
                                    </div>
                                    <div className='d-flex justify-content-center align-items-center rounded-circle' style={{ width: '20px', height: '20px', padding: '4px', background: '#EBF8FF', marginTop: '25px' }}>
                                        <X color='#1AB2FF' size={12} />
                                    </div>
                                </div>
                            </Col>

                            <Col>
                                <div className='d-flex justify-content-between align-items-center'>
                                    <div className='d-flex flex-column'>
                                        <label>Markup/Margin</label>
                                        <div className='d-flex gap-1 align-items-center'>
                                            <InputNumber className={clsx(style.inputNumber2)} value={parseFloat(tempCalculator?.profit_type_value || 0)}
                                                onValueChange={(e) => setTempCalculator((others) => ({ ...others, profit_type_value: e.value }))}
                                                maxFractionDigits={2}
                                                minFractionDigits={2}
                                                max={tempCalculator?.profit_type === "MRG" ? 99.99 : undefined}
                                            />
                                            <select value={tempCalculator?.profit_type}
                                                style={{ border: '0px solid #fff', background: 'transparent', fontSize: '14px' }}
                                                onChange={(e) => setTempCalculator((others) => ({ ...others, profit_type: e.target.value }))}
                                            >
                                                <option value={"MRG"}>MRG %</option>
                                                <option value={"AMN"}>AMT $</option>
                                                <option value={"MRK"}>MRK %</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className='d-flex justify-content-center align-items-center rounded-circle pt-3' style={{ width: '20px', height: '20px' }}>
                                        =
                                    </div>
                                </div>
                            </Col>

                            <Col>
                                <div className='d-flex justify-content-between align-items-center'>
                                    <div className='d-flex flex-column'>
                                        <label className='mb-2'>Unit Price</label>
                                        <div className='d-flex gap-2 align-items-center'>
                                            <strong>${calculateUnitPrice(tempCalculator)}</strong>
                                        </div>
                                    </div>
                                    <div className='d-flex justify-content-center align-items-center rounded-circle' style={{ width: '20px', height: '20px', background: '#EBF8FF', marginTop: '30px' }}>
                                        <X color='#1AB2FF' size={12} />
                                    </div>
                                </div>
                            </Col>

                            <Col>
                                <div className='d-flex justify-content-between align-items-center'>
                                    <div className='d-flex flex-column'>
                                        <label>Quantity/Hours</label>
                                        <div className='d-flex gap-2 align-items-center'>
                                            <InputNumber className={clsx(style.inputNumber2)}
                                                inputId="withoutgrouping"
                                                value={parseInt(tempCalculator?.quantity || 0)}
                                                onValueChange={(e) => setTempCalculator((others) => ({ ...others, quantity: e.value }))}
                                            />
                                            <select value={tempCalculator?.type}
                                                style={{ border: '0px solid #fff', background: 'transparent', fontSize: '14px' }}
                                                onChange={(e) => setTempCalculator((others) => ({ ...others, type: e.target.value }))}
                                            >
                                                <option value="Cost">1/Q</option>
                                                <option value="Hourly">1/H</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className='d-flex justify-content-center align-items-center rounded-circle pt-3' style={{ width: '20px', height: '20px' }}>
                                        =
                                    </div>
                                </div>
                            </Col>

                            <Col>
                                <label className='mb-2'>Sub Total:</label>
                                <strong>$ {parseFloat(tempCalculator?.total || 0).toFixed(2)}</strong>
                            </Col>
                        </Row>

                        <div className='d-flex justify-content-between align-items-center mt-4'>
                            <span></span>
                            <div className={clsx(style.RItem)}>
                                <Button className={style.delete} onClick={() => setIsEdit(false)}><Backspace color="#B42318" size={18} className='me-2' />Cancel</Button>
                                <Button className={style.create} onClick={saveCalculator}>
                                    {
                                        isLoading ? <ProgressSpinner className='me-2' style={{ width: '18px', height: '18px' }} />
                                            : <Save color="#106B99" size={18} className='me-2' />
                                    }
                                    Save Calculator
                                </Button>
                            </div>
                        </div>
                    </>
                ) : (
                    <>

                        <h6>Description</h6>
                        <p>{calculator?.description || ""}</p>
                        <Row>
                            <Col>
                                <label>Cost</label>
                                <strong>${formatAUD(parseFloat((calculator?.cost || 0)).toFixed(2))}</strong>
                            </Col>
                            <Col>
                                <label>Margin/Markup</label>
                                <strong>
                                    {parseFloat(calculator?.profit_type_value || 0).toFixed(2)}{" "}
                                    {
                                        calculator?.profit_type === "AMN"
                                            ? "AMT $"
                                            : calculator?.profit_type === "MRG"
                                                ? "MRG %"
                                                : "MRK %"
                                    }
                                </strong>
                            </Col>
                            <Col>
                                <label>Unit Price</label>
                                <strong>${formatAUD(calculateUnitPrice(calculator))}</strong>
                            </Col>
                            <Col>
                                <label>Quantity/Hours</label>
                                <strong>{parseFloat(calculator?.quantity || 0)}</strong>
                            </Col>
                            <Col>
                                <label>Sub Total:</label>
                                <strong>${formatAUD(parseFloat(calculator.total || 0).toFixed(2))}</strong>
                            </Col>
                        </Row>
                        <div className='d-flex justify-content-between align-items-center mt-4'>
                            <span></span>
                            <div className={clsx(style.RItem)}>
                                <DeleteConfirmationModal title={"Calculator"} api={`/references/calculators/delete/${calculator.id}/`} refetch={() => refetch(index)} />
                                <Button className={style.create} onClick={() => setIsEdit(true)}><PencilSquare color="#106B99" size={18} className='me-2' />Edit Calculator</Button>
                            </div>
                        </div>
                    </>
                )
            }
        </div>
    );
};

const NewCalculator = ({ index, name, refetch, cancelCreateCalculator }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [tempCalculator, setTempCalculator] = useState({
        profit_type: "MRG", // Default profit type
        profit_type_value: 0,
        cost: undefined,
        quantity: undefined,
        discount: 0,
        total: 0,
        description: "",
        type: "Cost",
    });

    // Ensure profit_type_value does not exceed 99.99 for "MRG"
    useEffect(() => {
        if (tempCalculator.profit_type === "MRG") {
            setTempCalculator((prev) => ({
                ...prev,
                profit_type_value: Math.min(prev.profit_type_value, 99.99),
            }));
        }
    }, [tempCalculator.profit_type, tempCalculator.profit_type_value]);

    // Calculate subtotal & total using useMemo to prevent unnecessary re-renders
    const calculatedTotal = useMemo(() => {
        let subtotal = (parseFloat(tempCalculator.cost) || 0) * (parseFloat(tempCalculator.quantity) || 0);
        let margin = parseFloat(tempCalculator.profit_type_value) || 0;

        if (tempCalculator.profit_type === "MRK") {
            subtotal += (subtotal * margin) / 100;
        } else if (tempCalculator.profit_type === "MRG") {
            subtotal = subtotal / (1 - margin / 100);
        } else if (tempCalculator.profit_type === "AMN") {
            subtotal += margin;
        }

        let discount = parseFloat(tempCalculator.discount) || 0;
        return (subtotal - (subtotal * discount) / 100).toFixed(2);
    }, [tempCalculator.cost, tempCalculator.quantity, tempCalculator.profit_type, tempCalculator.profit_type_value, tempCalculator.discount]);

    // Update total only when needed
    useEffect(() => {
        if (calculatedTotal !== tempCalculator.total) {
            setTempCalculator((prev) => ({ ...prev, total: calculatedTotal }));
        }
    }, [calculatedTotal, tempCalculator.total]);

    // Save Calculator Function
    const saveCalculator = async () => {
        const payload = {
            title: name || "",
            description: tempCalculator.description,
            type: tempCalculator.type === "Cost" ? 0 : 1,
            cost: tempCalculator.cost,
            quantity: tempCalculator.quantity,
            profit_type: tempCalculator.profit_type,
            profit_type_value: tempCalculator.profit_type_value,
            total: tempCalculator.total,
        };

        try {
            setIsLoading(true);
            await createCalculator(index, payload);
            toast.success("Calculator created successfully.");
            cancelCreateCalculator(null);
            refetch(index);
        } catch (error) {
            console.error("Error during creating calculator", error);
            toast.error("Failed to create calculator. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={`${style.contentStyle}`}>
            <h6>Full Description</h6>
            <InputTextarea autoResize value={tempCalculator?.description}
                onChange={(e) => setTempCalculator((others) => ({ ...others, description: e.target.value }))}
                className='w-100 border mb-3' rows={5} style={{ height: '145px', overflow: 'auto', resize: 'none', outline: 'none', boxShadow: 'none' }} />

            <Row>
                <Col>
                    <div className='d-flex gap-2 justify-content-between align-items-center'>
                        <div className='left'>
                            <label>Cost</label>
                            <InputNumber className={clsx(style.inputNumber)} prefix="$" value={tempCalculator?.cost && parseFloat(tempCalculator?.cost || 0)}
                                onValueChange={(e) => setTempCalculator((others) => ({ ...others, cost: e.value }))}
                                maxFractionDigits={2}
                                minFractionDigits={2}
                                placeholder='$0.00'
                                inputId="minmaxfraction"
                            />
                        </div>
                        <div className='d-flex justify-content-center align-items-center rounded-circle' style={{ width: '20px', height: '20px', padding: '4px', background: '#EBF8FF', marginTop: '20px' }}>
                            <X color='#1AB2FF' size={12} />
                        </div>
                    </div>
                </Col>

                <Col>
                    <div className='d-flex justify-content-between align-items-center'>
                        <div className='d-flex flex-column'>
                            <label className='d-block text-center'>Markup/Margin</label>
                            <div className='d-flex gap-1 align-items-center'>
                                <InputNumber className={clsx(style.inputNumber2)} value={parseFloat(tempCalculator?.profit_type_value || 0)}
                                    onValueChange={(e) => setTempCalculator((others) => ({ ...others, profit_type_value: parseFloat(e.value) }))}
                                    max={tempCalculator?.profit_type === "MRG" ? 99.99 : undefined}
                                    maxFractionDigits={2}
                                    minFractionDigits={2}
                                    useGrouping={false}
                                    placeholder='0.00'
                                />
                                <select value={tempCalculator?.profit_type}
                                    style={{ border: '0px solid #fff', background: 'transparent', fontSize: '14px' }}
                                    onChange={(e) => setTempCalculator((others) => ({ ...others, profit_type: e.target.value }))}
                                >
                                    <option value={"MRG"}>MRG %</option>
                                    <option value={"AMN"}>AMT $</option>
                                    <option value={"MRK"}>MRK %</option>
                                </select>
                            </div>
                        </div>

                        <div className='d-flex justify-content-center align-items-center rounded-circle pt-3' style={{ width: '20px', height: '20px' }}>
                            =
                        </div>
                    </div>
                </Col>

                <Col>
                    <div className='d-flex justify-content-between align-items-center'>
                        <div className='d-flex flex-column'>
                            <label className='mb-2'>Unit Price</label>
                            <div className='d-flex gap-2 align-items-center'>
                                <strong>$ {calculateUnitPrice(tempCalculator)}</strong>
                            </div>
                        </div>
                        <div className='d-flex justify-content-center align-items-center rounded-circle' style={{ width: '20px', height: '20px', background: '#EBF8FF', marginTop: '35px' }}>
                            <X color='#1AB2FF' size={12} />
                        </div>
                    </div>
                </Col>

                <Col>
                    <div className='d-flex justify-content-between align-items-center'>
                        <div className='d-flex flex-column'>
                            <label>Quantity/Hours</label>
                            <div className='d-flex gap-2 align-items-center'>
                                <InputNumber className={clsx(style.inputNumber2)}
                                    inputId="withoutgrouping"
                                    placeholder='0'
                                    value={tempCalculator?.quantity && parseInt(tempCalculator?.quantity || 0)}
                                    onValueChange={(e) => setTempCalculator((others) => ({ ...others, quantity: e.value }))}
                                />
                                <select value={tempCalculator?.type}
                                    style={{ border: '0px solid #fff', background: 'transparent', fontSize: '14px' }}
                                    onChange={(e) => setTempCalculator((others) => ({ ...others, type: e.target.value }))}
                                >
                                    <option value="Cost">1/Q</option>
                                    <option value="Hourly">1/H</option>
                                </select>
                            </div>
                        </div>
                        <div className='d-flex justify-content-center align-items-center rounded-circle' style={{ width: '20px', height: '20px', marginTop: '20px' }}>
                            =
                        </div>
                    </div>
                </Col>

                <Col>
                    <label className='mb-2'>Sub Total:</label>
                    <strong>$ {parseFloat(tempCalculator?.total || 0).toFixed(2)}</strong>
                </Col>
            </Row>

            <div className='d-flex justify-content-between align-items-center mt-4'>
                <span></span>
                <div className={clsx(style.RItem)}>
                    <Button className={style.delete} onClick={() => cancelCreateCalculator(null)}><Backspace color="#B42318" size={18} className='me-2' />Cancel</Button>
                    <Button className={style.create} onClick={saveCalculator}>
                        {
                            isLoading ? <ProgressSpinner className='me-2' style={{ width: '18px', height: '18px' }} />
                                : <Save color="#106B99" size={18} className='me-2' />
                        }
                        Save Calculator
                    </Button>
                </div>
            </div>
        </div>
    );
};

const ViewCalculators = ({ calculators = [], index, name, refetch, isNewCreate, cancelCreateCalculator }) => {
    const uniqueCalculators = calculators.filter((item, index, self) =>
        index === self.findIndex((t) => t.id === item.id && !item?.deleted)
    );
    const summary = calculateSummary(uniqueCalculators, 'no');

    return (
        <div>
            {
                isNewCreate && <NewCalculator index={index} name={name} refetch={refetch} cancelCreateCalculator={cancelCreateCalculator} />
            }

            {
                uniqueCalculators?.map(calculator => (
                    <ViewSectionComponent key={calculator.id} index={index} calculator={calculator} refetch={refetch} />
                ))
            }

            <div className={style.calculateBox}>
                <ul>
                    <li>
                        <div className={`${style.boxcal}`}>
                            <h6>Budget</h6>
                            <strong>{formatAUD(+summary.budget)}</strong>
                        </div>
                        <div className={`${style.profit} ${style.boxcal}`}>
                            <h6>Operational Profit</h6>
                            <strong>{formatAUD(+summary.operationalProfit)}</strong>
                        </div>
                    </li>
                    <li>
                        <div className={`${style.boxcal}`}>
                            <h6>Total</h6>
                            <strong>{formatAUD(+summary.total)}</strong>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    );
};

const EditCalculators = ({ editSubIndex, calculators }) => {
    const [updatedCalculator, setUpdatedCalculator] = useState(calculators || []);
    const summary = calculateSummary(calculators, 'no');

    const setValue = (value, id, field) => {

    };
    return (
        <div>
            {
                updatedCalculator.map(calculator => (
                    <div key={calculator.id} className={`${style.contentStyle}`}>
                        <h6>Full Description</h6>
                        <InputTextarea autoResize value={calculator.description} onChange={(e) => setValue(e.target.value, calculator.id, 'description')} className='w-100 border mb-3' rows={5} style={{ height: '145px', overflow: 'auto', resize: 'none' }} />

                        <Row>
                            <Col sm={2}>
                                <div className='d-flex justify-content-between align-items-center'>
                                    <div className='left'>
                                        <label>Cost</label>
                                        <InputNumber prefix="$" value={parseFloat((calculator?.cost || 0))} onValueChange={() => { }} maxFractionDigits={2} />
                                    </div>
                                    <div className='d-flex justify-content-center align-items-center rounded-circle' style={{ width: '20px', height: '20px', background: '#EBF8FF' }}>
                                        <X color='#1AB2FF' size={12} />
                                    </div>
                                </div>
                            </Col>
                            <Col sm={2}>
                                <div className='d-flex justify-content-between align-items-center'>
                                    <div className='left'>
                                        <label>Margin</label>
                                        <InputNumber prefix="$" value={parseFloat((calculator?.profit_type_value || 0))} onValueChange={() => { }} maxFractionDigits={2} />
                                    </div>
                                    <div className='d-flex justify-content-center align-items-center rounded-circle' style={{ width: '20px', height: '20px', background: '#EBF8FF' }}>
                                        <X color='#1AB2FF' size={12} />
                                    </div>
                                </div>
                            </Col>
                            <Col sm={2}>
                                <div className='d-flex justify-content-between align-items-center'>
                                    <div className='left'>
                                        <label>Margin</label>
                                        <InputNumber prefix="$" value={parseFloat((calculator?.profit_type_value || 0))} onValueChange={() => { }} maxFractionDigits={2} />
                                    </div>
                                    <div className='d-flex justify-content-center align-items-center rounded-circle' style={{ width: '20px', height: '20px', background: '#EBF8FF' }}>
                                        <X color='#1AB2FF' size={12} />
                                    </div>
                                </div>
                            </Col>
                            <Col sm={3}>
                                <div className='d-flex justify-content-between align-items-center'>
                                    <div className='left'>
                                        <label>Budget</label>
                                        <InputNumber prefix="$" value={parseFloat((calculator?.quantity || 0))} onValueChange={() => { }} maxFractionDigits={2} />
                                    </div>
                                    <div className='d-flex justify-content-center align-items-center rounded-circle' style={{ width: '20px', height: '20px' }}>
                                        =
                                    </div>
                                </div>
                            </Col>
                            <Col sm={3}>
                                <label>Sub Total:</label>
                                <strong>$ {parseFloat(calculator.total || 0).toFixed(2)}</strong>
                            </Col>
                        </Row>
                    </div>
                ))
            }
            <div className={style.calculateBox}>
                <ul>
                    <li>
                        <div className={`${style.boxcal}`}>
                            <h6>Budget</h6>
                            <strong>{formatMoney(+summary.budget)}</strong>
                        </div>
                        <div className={`${style.profit} ${style.boxcal}`}>
                            <h6>Operational Profit</h6>
                            <strong>{formatMoney(+summary.operationalProfit)}</strong>
                        </div>
                    </li>
                    <li>
                        <div className={`${style.boxcal}`}>
                            <h6>Total</h6>
                            <strong>{formatMoney(+summary.total)}</strong>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    );
};

const LoadingCalculator = () => {
    return (
        <div style={{ padding: '16px 24px 16px 52px' }}>
            <Skeleton width="10rem" className="mb-2"></Skeleton>
            <Skeleton className="mb-2"></Skeleton>
            <Skeleton className="mb-2"></Skeleton>
            <Skeleton className="mb-2"></Skeleton>
            <Row>
                <Col sm={3}>
                    <Skeleton width="4rem" className="mb-2"></Skeleton>
                    <Skeleton width="8rem" className="mb-2"></Skeleton>
                </Col>
                <Col sm={3}>
                    <Skeleton width="4rem" className="mb-2"></Skeleton>
                    <Skeleton width="5rem" className="mb-2"></Skeleton>
                </Col>
                <Col sm={3}>
                    <Skeleton width="4rem" className="mb-2"></Skeleton>
                    <Skeleton width="8rem" className="mb-2"></Skeleton>
                </Col>
            </Row>
            <Row>
                <Col sm={2} className='py-3 px-2'>
                    <Skeleton width="3rem" className="mb-2"></Skeleton>
                    <Skeleton width="100%" className="mb-2"></Skeleton>
                </Col>
                <Col sm={2} className='py-3 px-2'>
                    <Skeleton width="3rem" className="mb-2"></Skeleton>
                    <Skeleton width="100%" className="mb-2"></Skeleton>
                </Col>
                <Col sm={6}></Col>
                <Col sm={2} className='py-3'>
                    <Skeleton width="3rem" className="mb-2"></Skeleton>
                    <Skeleton width="100%" className="mb-2"></Skeleton>
                </Col>
            </Row>
        </div>
    );
};

const CreateDepartment = ({ visible, setVisible, refetch, editDepartment, setEditDepartment }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [department, setDepartment] = useState("");

    useEffect(() => {
        if (editDepartment?.name)
            setDepartment(editDepartment?.name);
    }, [editDepartment?.name]);

    const handleClose = () => {
        setVisible(false);
        setDepartment("");
        setEditDepartment({ id: null, name: null });
    };

    const handleCreateDepartment = async () => {
        try {
            if (department) {
                setIsLoading(true);

                if (editDepartment?.id) {
                    await updateDepartment(editDepartment?.id, { name: department });
                    toast.success(`Department updated successfully.`);
                    setEditDepartment({ id: null, name: null });
                } else {
                    await createDepartment({ name: department });
                    toast.success(`New department created successfully.`);

                    const container = document.querySelector(".content_wrap_main");
                    if (container) {
                        setTimeout(() => {
                            container.scrollTo({ top: container.scrollHeight + 100, behavior: "smooth" });
                        }, 500);
                    }
                }

                refetch();
                handleClose();
            }
        } catch (error) {
            console.error(`Error ${editDepartment?.id ? 'updating' : 'creating'} department:`, error);
            toast.error(`Failed to ${editDepartment?.id ? 'update' : 'create'} department. Please try again.`);
        } finally {
            setIsLoading(false);
        }
    };

    const headerElement = (
        <div className={`${style.modalHeader}`}>
            <div className="d-flex align-items-center gap-2">
                <div className={style.circledesignstyle}>
                    <div className={style.out}>
                        <PlusCircle size={24} color="#17B26A" className='mb-3' />
                    </div>
                </div>
                <span className={`white-space-nowrap ${style.headerTitle}`}>
                    {editDepartment?.id ? "Edit Department" : "Create Department"}
                </span>
            </div>
        </div>
    );

    const footerContent = (
        <div className='d-flex justify-content-end gap-2'>
            <Button className='outline-button' onClick={handleClose}>Cancel</Button>
            <Button className='solid-button' style={{ width: '132px' }} onClick={handleCreateDepartment} disabled={department?.length < 1}>{isLoading ? "Loading..." : "Save Details"}</Button>
        </div>
    );

    return (
        <>
            <Dialog visible={visible} modal={true} header={headerElement} footer={footerContent} className={`${style.modal} custom-modal`} onHide={handleClose}>
                <div className="d-flex flex-column">
                    <p className="font-14 mb-1" style={{ color: '#475467', fontWeight: 500 }}>Department name</p>
                    <InputText value={department} onChange={(e) => setDepartment(e.target.value)} className={style.inputBox} />
                </div>
            </Dialog>
        </>
    );
};

const CreateSubDepartmentModal = ({ visible2, setVisible2, refetch, editSubDepartment, setEditSubDepartment }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [subDepartment, setSubDepartment] = useState("");
    const parent = editSubDepartment?.parent;

    useEffect(() => {
        if (editSubDepartment?.name)
            setSubDepartment(editSubDepartment?.name);
    }, [editSubDepartment?.name]);

    const handleClose = () => {
        setVisible2(false);
        setSubDepartment("");
        setEditSubDepartment({ id: null, name: null, parent: null });
    };

    const handleCreateSubDepartment = async () => {
        try {
            if (subDepartment) {
                if (!parent) return toast.error('Parent id not found');

                setIsLoading(true);

                if (editSubDepartment?.id) {
                    await updateSubDepartment(editSubDepartment?.id, { name: subDepartment, parent });
                    toast.success(`Sub department updated successfully.`);
                    setEditSubDepartment({ id: null, name: null, parent: null });
                } else {
                    await createSubDepartment({ name: subDepartment, parent });
                    toast.success(`New sub department created successfully.`);
                }

                refetch();
                handleClose();
            }
        } catch (error) {
            console.error(`Error ${editSubDepartment?.id ? 'updating' : 'creating'} sub department:`, error);
            toast.error(`Failed to ${editSubDepartment?.id ? 'update' : 'create'} sub department. Please try again.`);
        } finally {
            setIsLoading(false);
        }
    };

    const headerElement = (
        <div className={`${style.modalHeader}`}>
            <div className="d-flex align-items-center gap-2">
                <div className={style.circledesignstyle}>
                    <div className={style.out}>
                        <PlusCircle size={24} color="#17B26A" className='mb-3' />
                    </div>
                </div>
                <span className={`white-space-nowrap ${style.headerTitle}`}>
                    {editSubDepartment?.id ? "Edit Sub Department" : "Create Sub Department"}
                </span>
            </div>
        </div>
    );

    const footerContent = (
        <div className='d-flex justify-content-end gap-2'>
            <Button className='outline-button' onClick={handleClose}>Cancel</Button>
            <Button className='solid-button' style={{ width: '132px' }} onClick={handleCreateSubDepartment} disabled={subDepartment?.length < 1}>{isLoading ? "Loading..." : "Save Details"}</Button>
        </div>
    );

    return (
        <>
            <Dialog visible={visible2} modal={true} header={headerElement} footer={footerContent} className={`${style.modal} custom-modal`} onHide={handleClose}>
                <div className="d-flex flex-column">
                    <p className="font-14 mb-1" style={{ color: '#475467', fontWeight: 500 }}>Sub Department name</p>
                    <InputText value={subDepartment} onChange={(e) => setSubDepartment(e.target.value)} className={style.inputBox} />
                </div>
            </Dialog>
        </>
    );
};

export default Departments;
