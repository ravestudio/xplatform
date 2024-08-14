import * as React from "react";

import "../../index.scss";

const drawerWidth = 240;

export default (props: { children?: React.ReactNode }) => {
  return (
    <div className="root">
      <div className="container column main">{props.children}</div>
    </div>
  );
};
