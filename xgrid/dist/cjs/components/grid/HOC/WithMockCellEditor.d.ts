import React from "react";
import { ICellRendererParams } from "ag-grid-community";
export interface WithMockCellEditorProps {
    isMockEditing: boolean;
}
declare const WithMockCellEditor: <P extends ICellRendererParams>(WrappedComponent: React.ComponentClass<P>) => React.ComponentClass<P>;
export default WithMockCellEditor;
