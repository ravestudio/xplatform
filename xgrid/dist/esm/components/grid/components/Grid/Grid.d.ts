import React from "react";
import { WithMockEditingIdProps } from "../../HOC/WithMockEditingContext";
interface GridProps extends WithMockEditingIdProps {
    keyField: string;
    data: any[];
    selectedKeys?: any[];
    gridConfig: any;
    actionButtons?: any;
    onSelectionChanged?: (selectedRows: any) => void;
    checkboxSelection?: boolean;
    onSaving?: (data: any) => void;
    agGridProps?: any;
}
export declare function prepareColumns(cl: any): any;
declare const _default: React.ComponentClass<GridProps, any>;
export default _default;
