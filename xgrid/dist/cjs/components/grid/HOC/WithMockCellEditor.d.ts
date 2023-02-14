import React from "react";
import { ICellRendererParams } from "ag-grid-community";
export interface WithMockCellEditorProps {
    isMockEditing: boolean;
}
declare const WithMockCellEditor: <P extends ICellRendererParams>(WrappedComponent: React.ComponentClass<P, any>) => React.ComponentClass<P, any>;
export default WithMockCellEditor;
