import * as React from "react";

import "../../index.scss";

const drawerWidth = 240;

export default (props: { children?: React.ReactNode }) => {
  return (
    <div className="root">
      <div className="container container_main container_column">
        {props.children}
      </div>
    </div>
  );
};
