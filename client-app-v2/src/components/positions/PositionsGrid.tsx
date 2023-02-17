import * as React from "react";

import { Grid } from "@ravestudio/xgrid";

interface IProps {
  keyField: string;
  items: any;
  gridConfig: any;
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

  return (
    /* @ts-ignore */
    <Grid
      keyField={props.keyField}
      ref={refGrid}
      data={props.items}
      gridConfig={props.gridConfig}
      onSelectionChanged={props.onSelectionChanged}
    />
  );
});

deals.displayName = "x-positions";

export default deals;
