import { Button } from 'react-bootstrap';
import { useMutation } from '@tanstack/react-query';
import { ProgressSpinner } from 'primereact/progressspinner';
import { toast } from 'sonner';
import { downloadStatement } from '../../../../../APIs/expenses-api';

const CreateStatement = ({ invoices }) => {
    const clientName = invoices?.length > 0 ? (invoices[0]?.client?.name || "") : '';

    const downloadStatementMutation = useMutation({
        mutationFn: (data) => downloadStatement(data),
        onSuccess: (data) => {
            const url = data?.pdf_url || data;
            if (!url) return;
            window.open(`/invoice/account-statement?pdf=${url}&client=${clientName}`, '_blank');
        },
        onError: (error) => {
            console.log('error: ', error);
            toast.error(`Failed to download statement. Please try again.`);
        }
    });

    const handleDownload = () => {
        const invoiceIds = invoices.map(item => item.id);
        downloadStatementMutation.mutate(invoiceIds);
    };

    return (
        <>
            <Button className={"solid-button font-14"} style={{ height: '32px' }} onClick={handleDownload}>
                Create Statement
                {downloadStatementMutation?.isPending && <ProgressSpinner style={{ width: '20px', height: '20px' }} />}
            </Button>
        </>
    );
};

export default CreateStatement;