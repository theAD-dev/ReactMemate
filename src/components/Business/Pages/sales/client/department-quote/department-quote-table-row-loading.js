import React from 'react';
import Placeholder from 'react-bootstrap/Placeholder';

export const DepartmentQuoteTableRowLoading = ({ isDiscountActive }) => {
    return (
        <tr>
            <td style={{ width: "24px" }}>
                <Placeholder as="p" animation="wave">
                    <Placeholder xs={12} />
                </Placeholder>
            </td>

            <td style={{ width: '64px', textAlign: 'center' }}>
                <Placeholder as="p" animation="wave">
                    <Placeholder xs={12} />
                </Placeholder>
            </td>
            <td style={{ width: '600px' }}>
                <Placeholder as="p" animation="wave">
                    <Placeholder xs={12} />
                </Placeholder>
            </td>

            <td style={{ width: '128px' }}>
                <Placeholder as="p" animation="wave">
                    <Placeholder xs={12} />
                </Placeholder>
            </td>
            <td style={{ width: '166px' }}>
                <Placeholder as="p" animation="wave">
                    <Placeholder xs={12} />
                </Placeholder>
            </td>
            <td style={{ width: '185px' }}>
                <Placeholder as="p" animation="wave">
                    <Placeholder xs={12} />
                </Placeholder>
            </td>
            {
                isDiscountActive &&
                <td style={{ width: '83px' }}>
                    <Placeholder as="p" animation="wave">
                        <Placeholder xs={12} />
                    </Placeholder>
                </td>
            }
            <td style={{ width: '118px' }}>
                <Placeholder as="p" animation="wave">
                    <Placeholder xs={12} />
                </Placeholder>
            </td>
            <td style={{ width: '32px' }}>
                <Placeholder as="p" animation="wave">
                    <Placeholder xs={12} />
                </Placeholder>
            </td>
        </tr>
    );
};