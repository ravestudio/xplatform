import React from "react";
import { ICellRendererParams } from "ag-grid-community";
export interface WithMockCellRendererProps {
    isMockEditing: boolean;
}
declare const WithMockCellRenderer: <P extends ICellRendererParams>(WrappedComponent: React.ComponentClass<P, any>) => React.ComponentClass<P, any>;
export default WithMockCellRenderer;
