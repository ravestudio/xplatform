import React from "react";

import {
  GetRowNodeIdFunc,
  GridApi,
  GridOptions,
  GridReadyEvent,
  ICellRenderer,
  RefreshCellsParams,
  RowNode,
} from "ag-grid-community";
import TextFieldRenderer from "../TextFieldRender/TextFieldRender";
import { AgGridReact } from "ag-grid-react";
import ActionsRenderer from "../ActionsRenderer/ActionsRenderer";
import WithMockEditingContext, {
  WithMockEditingIdProps,
} from "../../HOC/WithMockEditingContext";
import {
  IMockEditingContext,
  MockEditingContext,
} from "../../context/MockEditingContext";
import {
  IMockCellEditor,
  instanceOfIMockCellEditor,
} from "../../interfaces/mockCellEditor";

//import "./Grid.scss";

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

interface GridState {
  /** grid config the ag-Grid instances */
  gridOptions: GridOptions;
}

const getCellRender = (cl: any) => {
  if (cl.columns && cl.columns.length > 0) {
    return {};
  }

  return {
    cellRenderer: TextFieldRenderer,
    cellRendererParams: {
      ...cl.editorParams,
    },
  };
};

export function prepareColumns(cl: any): any {
  return {
    ...cl,
    ...getCellRender(cl),
  };
}

class Grid extends React.Component<GridProps, GridState> {
  private gridApi: GridApi | null = null;

  static contextType: React.Context<IMockEditingContext> = MockEditingContext;

  public constructor(props: GridProps) {
    super(props);

    this.state = {
      gridOptions: {
        columnDefs: [
          ...(this.props.checkboxSelection
            ? [
                {
                  checkboxSelection: true,
                  width: 70,
                },
              ]
            : []),
          ...props.gridConfig.columns.map((c: any) => prepareColumns(c)),
          {
            cellRenderer: ActionsRenderer,
            cellRendererParams: {
              editing: { ...this.props.gridConfig.editing },
              commit: this.commitChanges,
              rollback: this.rollbackChanges,
              delete: this.deleteItem,

              actionButtons: this.props.actionButtons
                ? this.props.actionButtons.actions
                : [
                    {
                      name: "edit",
                    },
                    {
                      name: "delete",
                    },
                  ],
            },
            width: 190,
            pinned: "right",
          },
        ],

        suppressColumnVirtualisation: true,
        suppressRowVirtualisation: true,
        rowSelection: "single",
      },
    };
  }

  public componentDidUpdate(prevProps: GridProps): void {
    if (prevProps.mockEditingId !== this.props.mockEditingId) {
      const idToUpdate: string =
        this.props.mockEditingId === null
          ? prevProps.mockEditingId
          : this.props.mockEditingId;
      const nodeToUpdate: RowNode = this.gridApi.getRowNode(idToUpdate);
      const refreshCellsParams: RefreshCellsParams = {
        rowNodes: [nodeToUpdate],
        force: true,
      };

      //если ноды не удалены операцией роллбек то обновляем
      if (nodeToUpdate) {
        this.gridApi.refreshCells(refreshCellsParams);
      }
    }
  }

  private onGridReady = (params: GridReadyEvent): void => {
    this.gridApi = params.api;
  };

  private getRowNodeId: GetRowNodeIdFunc = (item: any): string => {
    return item[this.props.keyField];
  };

  onSelectionChanged = () => {
    const selectedRows = this.gridApi.getSelectedRows();

    if (this.props.onSelectionChanged) {
      this.props.onSelectionChanged(selectedRows);
    }
  };

  private deleteItem = (item: any): void => {
    const { [this.props.keyField]: id, ...data } = item;

    const e = {
      cancel: false,
      type: "remove",
      key: id,
      data,
    };

    if (this.props.onSaving) {
      const { [this.props.keyField]: id, ...data } = item;

      this.props.onSaving(e);
    }

    if (e.cancel) return;

    const res = this.gridApi.applyTransaction({ remove: [item] });
  };

  private commitChanges = (): void => {
    const mockEditingNode: RowNode = this.gridApi.getRowNode(
      this.context.mockEditingId
    );
    const updatedData: any = { ...mockEditingNode.data };

    const mockEditors: IMockCellEditor[] = this.getMockEditors(mockEditingNode);

    mockEditors.forEach((mockEditor) => {
      const [field, updatedValue]: ["description" | "fieldId", any] =
        mockEditor.getValue();

      updatedData[field] = updatedValue;
    });

    const res = this.gridApi.applyTransaction({ update: [updatedData] });
  };

  private rollbackChanges = (): void => {
    const mockEditingNode: RowNode = this.gridApi.getRowNode(
      this.context.mockEditingId
    );

    const mockEditors: IMockCellEditor[] = this.getMockEditors(mockEditingNode);
    mockEditors.forEach((mockEditor) => {
      mockEditor.reset();
    });
  };

  private getMockEditors = (node: RowNode): IMockCellEditor[] => {
    const mockEditors: IMockCellEditor[] = this.gridApi
      .getCellRendererInstances({
        rowNodes: [node],
      })
      .map((cellRenderer) => cellRenderer as any)

      .filter((cellRenderer) => instanceOfIMockCellEditor(cellRenderer));
    return mockEditors;
  };

  onFirstDataRendered = (params: any) => {
    if (this.props.selectedKeys !== undefined) {
      params.api.forEachNode((node: any) =>
        node.setSelected(
          !!node.data &&
            this.props.selectedKeys.indexOf(node.data[this.props.keyField]) >= 0
        )
      );
    }
  };

  public render(): React.ReactElement {
    const defaultColDef = {
      editable: false,
      sortable: true,
      //flex: 1,
      minWidth: 10,
      filter: true,
      resizable: true,
    };

    return (
      <div className="ag-grid">
        <div className="grid-toolbar">
          <button>add</button>
        </div>
        <div className="ag-theme-alpine" style={{ flexGrow: 1, width: "100%" }}>
          <AgGridReact
            rowData={this.props.data}
            gridOptions={this.state.gridOptions}
            defaultColDef={defaultColDef}
            getRowNodeId={this.getRowNodeId}
            onGridReady={this.onGridReady}
            {...this.props.agGridProps}
            onSelectionChanged={this.onSelectionChanged}
            onFirstDataRendered={this.onFirstDataRendered}
          />
        </div>
      </div>
    );
  }
}

export default WithMockEditingContext<GridProps>(Grid);
