import React from "react";
import { ICellRendererParams } from "ag-grid-community";
export interface WithMockCellRendererProps {
    isMockEditing: boolean;
}
declare const WithMockCellRenderer: <P extends ICellRendererParams>(WrappedComponent: React.ComponentClass<P>) => React.ComponentClass<P>;
export default WithMockCellRenderer;
