import React from "react";
import { ICellRendererParams } from "ag-grid-community";
import { WithMockCellRendererProps } from "../../HOC/WithMockCellRenderer";
interface ActionsRendererProps extends ICellRendererParams, WithMockCellRendererProps {
    commit: () => null;
    rollback: () => null;
    delete: (item: any) => void;
    actionButtons: any[];
}
declare const _default: React.ComponentClass<ActionsRendererProps, any>;
export default _default;
