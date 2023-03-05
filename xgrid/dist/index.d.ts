/// <reference types="react" />
import React from 'react';

interface ButtonProps {
    label: string;
}
declare const Button: (props: ButtonProps) => JSX.Element;

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
    agGridProps?: any;
}
declare const _default: React.ComponentClass<GridProps, any>;

export { Button as Dutton, _default as Grid };
