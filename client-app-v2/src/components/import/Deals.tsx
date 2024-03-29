import * as React from "react";

import { Grid } from "@ravestudio/xgrid";

interface IProps {
  keyField: string;
  items: any;
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
        field: "number",
        headerName: "number",
        width: 50,
      },
      {
        field: "board",
        headerName: "board",
        width: 150,
      },
      {
        field: "symbol",
        headerName: "symbol",
        width: 50,
      },
      {
        field: "operation",
        headerName: "operation",
        width: 50,
      },
      {
        field: "date",
        headerName: "date",
        width: 100,
      },
      {
        field: "time",
        headerName: "time",
        width: 100,
      },
      {
        field: "delivery_date",
        headerName: "delivery_date",
        width: 100,
      },
      {
        field: "price",
        headerName: "price",
        width: 100,
      },
      {
        field: "count",
        headerName: "count",
        width: 100,
      },
      {
        field: "volume",
        headerName: "volume",
        width: 100,
      },
      {
        field: "nkd",
        headerName: "nkd",
        width: 100,
      },
      {
        field: "client",
        headerName: "client",
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
    />
  );
});

deals.displayName = "x-import-deals";

export default deals;
