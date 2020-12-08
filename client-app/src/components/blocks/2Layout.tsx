import * as React from "react";

import "../../index.scss";

const drawerWidth = 240;

export default (props: { children?: React.ReactNode }) => {
  const [value, setValue] = React.useState(null);
  return (
    <div className="root">
      <div className="container">{props.children}</div>
    </div>
  );
};
