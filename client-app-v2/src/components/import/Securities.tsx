import * as React from "react";

import { Grid } from "@ravestudio/xgrid";

interface IProps {
  keyField: string;
  items: any;
  onSelectionChanged: (selectedRows: any) => void;
}

const deals = React.forwardRef((props: IProps, ref: any) => {
  const refGrid = React.useRef<any>(null);

  React.useImperativeHandle(ref, () => ({
    getGridApi() {
      const cmp = refGrid.current?.getCmp();

      return cmp?.getGridApi();
    },
  }));

  const config = {
    columns: [
      {
        field: "ticker",
        headerName: "ticker",
        width: 50,
      },
      {
        field: "name",
        headerName: "name",
        width: 250,
      },
      {
        field: "isin",
        headerName: "isin",
        width: 100,
      },
      {
        field: "figi",
        headerName: "figi",
        width: 100,
      },
      {
        field: "currency",
        headerName: "currency",
        width: 70,
      },
      {
        field: "emitent",
        headerName: "emitent",
        width: 100,
      },
      {
        field: "processed",
        headerName: "processed",
        width: 100,
      },
      {
        field: "board",
        headerName: "board",
        width: 100,
      },
      {
        field: "type",
        headerName: "type",
        width: 100,
      },
    ],
  };

  return (
    /* @ts-ignore */
    <Grid
      keyField={props.keyField}
      ref={refGrid}
      data={props.items}
      gridConfig={config}
      agGridProps={{
        rowSelection: "multiple",
      }}
      onSelectionChanged={props.onSelectionChanged}
      checkboxSelection={true}
      //selectedKeys={selectedKeys}
    />
  );
});

deals.displayName = "x-import-stock";

export default deals;
