import React from 'react';

interface ButtonProps {
    label: string;
}
declare const Button: (props: ButtonProps) => React.JSX.Element;

interface WithMockEditingIdProps {
    mockEditingId: string;
}

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
declare const _default: React.ComponentClass<GridProps, any>;

export { Button as Dutton, _default as Grid };
