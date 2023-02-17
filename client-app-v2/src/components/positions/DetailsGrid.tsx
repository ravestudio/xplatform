import * as React from "react";

import { Grid } from "@ravestudio/xgrid";

interface IProps {
  //keyField: string;
  items: any;
  gridConfig: any;
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
      //keyField={props.keyField}
      ref={refGrid}
      data={props.items}
      gridConfig={props.gridConfig}
    />
  );
});

deals.displayName = "x-positions-details";

export default deals;
