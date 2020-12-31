import React from "react";
import Tabs, { Tab } from "../tabs";

class Financials extends React.PureComponent<{}> {
  constructor(props: {}) {
    super(props);
  }

  public render() {
    return (
      <React.Fragment>
        <h1>Financials</h1>

        <Tabs value="incomes">
          <Tab label="Incomes" icon="fa-code" value="incomes" />
          <Tab label="Cash Flow" icon="fa-code" value="flows" />
          <Tab label="Balance Sheet" icon="fa-code" value="balance" />
        </Tabs>
      </React.Fragment>
    );
  }
}

export default Financials;
