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
        field: "code",
        headerName: "code",
        width: 50,
      },
      {
        field: "name",
        headerName: "name",
        flex: 1,
      },
      {
        field: "region",
        headerName: "region",
        width: 100,
      },
      {
        field: "loadDate",
        headerName: "loadDate",
        width: 150,
      },
      {
        field: "lastFinance",
        headerName: "lastFinance",
        width: 100,
      },
      {
        field: "status",
        headerName: "status",
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

deals.displayName = "x-import-financials";

export default deals;
