import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from 'primereact/button';
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from 'primereact/dialog';
import { InputSwitch } from "primereact/inputswitch";
import { ProgressSpinner } from "primereact/progressspinner";
import { toast } from "sonner";
import style from './add-remove-company-user.module.scss';
import { disableAssetType, enableAssetType } from "../../../../../APIs/settings-subscription-api";
import assetsIcon from '../../../../../assets/images/icon/assets.svg';

const ManageAssetTypes = ({ assetsTypes, visible, setVisible }) => {
  const [loadingStates, setLoadingStates] = useState({});
  const queryClient = useQueryClient();

  const enableMutation = useMutation({
    mutationFn: ({ asset, enabled }) => enableAssetType({ asset, enabled }),
    onSuccess: (data, variables) => {
      toast.success(`${variables.assetName} enabled successfully`);
      queryClient.invalidateQueries(['assets-types']);
      queryClient.invalidateQueries(['subscription']);
      setLoadingStates(prev => ({ ...prev, [variables.asset]: false }));
    },
    onError: (error, variables) => {
      console.error('Error enabling asset type:', error);
      toast.error(`Failed to enable ${variables.assetName}. Please try again.`);
      setLoadingStates(prev => ({ ...prev, [variables.asset]: false }));
    }
  });

  const disableMutation = useMutation({
    mutationFn: ({ asset, enabled }) => disableAssetType({ asset, enabled }),
    onSuccess: (data, variables) => {
      toast.success(`${variables.assetName} disabled successfully`);
      queryClient.invalidateQueries(['assets-types']);
      queryClient.invalidateQueries(['subscription']);
      setLoadingStates(prev => ({ ...prev, [variables.asset]: false }));
    },
    onError: (error, variables) => {
      console.error('Error disabling asset type:', error);
      toast.error(`Failed to disable ${variables.assetName}. Please try again.`);
      setLoadingStates(prev => ({ ...prev, [variables.asset]: false }));
    }
  });

  const handleToggle = (assetType, enabled) => {
    const assetId = assetType.id;
    const assetName = assetType.name;
    
    setLoadingStates(prev => ({ ...prev, [assetId]: true }));

    const payload = {
      asset: assetId,
      enabled: enabled
    };

    if (enabled) {
      enableMutation.mutate({ ...payload, assetName }); // assetName only for success/error messages
    } else {
      disableMutation.mutate({ ...payload, assetName }); // assetName only for success/error messages
    }
  };

  const headerElement = (
    <div className={`${style.modalHeader}`}>
      <div className={style.iconStyle}>
        <img src={assetsIcon} alt="assets" style={{ width: '24px', height: '24px' }} />
      </div>
      <span className={`white-space-nowrap ${style.headerTitle}`}>Manage Asset Types</span>
    </div>
  );

  const switchTemplate = (rowData) => {
    const isLoading = loadingStates[rowData.id];
    const isEnabled = rowData.enabled || false;

    return (
      <div className="d-flex align-items-center gap-2">
        {isLoading ? (
          <ProgressSpinner style={{ width: '20px', height: '20px' }} />
        ) : (
          <InputSwitch
            checked={isEnabled}
            onChange={(e) => handleToggle(rowData, e.value)}
            disabled={enableMutation.isPending || disableMutation.isPending}
          />
        )}
        <span className="text-sm">{isEnabled ? 'Enabled' : 'Disabled'}</span>
      </div>
    );
  };

  const nameTemplate = (rowData) => {
    return (
      <div className="d-flex align-items-center gap-2">
        <div className="font-medium">{rowData.name}</div>
      </div>
    );
  };

  const descriptionTemplate = (rowData) => {
    return (
      <div className="text-sm text-muted">
        {rowData.description || 'No description available'}
      </div>
    );
  };

  const footerContent = (
    <div className="d-flex justify-content-end align-items-center gap-3">
      <Button 
        type='button' 
        className='outline-button' 
        style={{ minWidth: '70px', borderRadius: '28px' }} 
        onClick={() => setVisible(false)}
      >
        Close
      </Button>
    </div>
  );

  return (
    <Dialog
      header={headerElement}
      visible={visible}
      style={{ width: '607px' }}
      onHide={() => setVisible(false)}
      footer={footerContent}
      draggable={false}
      resizable={false}
      className={style.modal}
    >
      <div className="p-3">
        <div className="mb-3">
          <p className="text-muted mb-0">
            Enable or disable asset types for your organization. Enabled asset types will be available for use across your system.
          </p>
        </div>

        {assetsTypes && assetsTypes.length > 0 ? (
          <DataTable 
            value={assetsTypes} 
            paginator={false}
            scrollable
            scrollHeight="400px"
            className="asset-types-table border"
            tableStyle={{ minWidth: '100%' }}
          >
            <Column 
              field="name" 
              header="Asset Type" 
              body={nameTemplate}
              style={{ width: '30%' }}
            />
            <Column 
              field="description" 
              header="Description" 
              body={descriptionTemplate}
              style={{ width: '50%' }}
            />
            <Column 
              field="enabled" 
              header="Status" 
              body={switchTemplate}
              style={{ width: '20%' }}
            />
          </DataTable>
        ) : (
          <div className="text-center py-4">
            <p className="text-muted">No asset types available</p>
          </div>
        )}
      </div>
    </Dialog>
  );
};

export default ManageAssetTypes;