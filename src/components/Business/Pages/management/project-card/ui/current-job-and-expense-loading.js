import { Placeholder } from 'react-bootstrap';

const CurrentJobAndExpenseLoading = () => {
    return (
        <tr>
            <td>
                <Placeholder as="p" animation="wave" className="mb-0">
                    <Placeholder xs={12} bg="secondary" className="rounded-0" size='sm' style={{ width: '80%', height: '14px', position: 'relative', left: '-10px' }} />
                </Placeholder>
            </td>
            <td>
                <Placeholder as="p" animation="wave" className="mb-0">
                    <Placeholder xs={12} bg="secondary" className="rounded-0" size='sm' style={{ width: '100%', height: '14px' }} />
                </Placeholder>
            </td>
            <td>
                <Placeholder as="p" animation="wave" className="mb-0">
                    <Placeholder xs={12} bg="secondary" className="rounded-0" size='sm' style={{ width: '100%', height: '14px' }} />
                </Placeholder>
            </td>
            <td>
                <Placeholder as="p" animation="wave" className="mb-0">
                    <Placeholder xs={12} bg="secondary" className="rounded-0" size='sm' style={{ width: '100%', height: '14px' }} />
                </Placeholder>
            </td>
            <td>
                <Placeholder as="p" animation="wave" className="mb-0">
                    <Placeholder xs={12} bg="secondary" className="rounded-0" size='sm' style={{ width: '100%', height: '14px' }} />
                </Placeholder>
            </td>
        </tr>
    );
};

export default CurrentJobAndExpenseLoading;