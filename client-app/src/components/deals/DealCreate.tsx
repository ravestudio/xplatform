import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Field, reduxForm } from "redux-form";
import * as SecuritiesStore from "../../store/Securities";
import * as DealStore from "../../store/Deals";
import { Paper } from "@mui/material";
import { Security } from "../../store/Securities";
import { Account } from "../../store/Accounts";
import { Deal } from "../../store/Deals";
import { ApplicationState } from "../../store";
import {
  createStyles,
  makeStyles,
  Theme,
  withStyles,
} from "@mui/material/styles";
import DealForm from "./DealForm";

import { format, parseISO, addHours } from "date-fns";

interface EditDealDialogProps {
  securities: Security[];
  accounts: Account[];
  classes: {
    root: string;
  };
}

const styles = (theme: Theme) => ({
  root: {
    /*'& .MuiGrid-item': {
                width: 200,
            },*/
  },
});

class DealCreate extends React.PureComponent<
  EditDealDialogProps &
    typeof SecuritiesStore.actionCreators &
    typeof DealStore.actionCreators
> {
  public componentDidMount() {
    this.props.requestSecurities();
  }

  submit = (values: any) => {
    // print the form values to the console
    console.log(values);

    const toMSK = (iso_dt: string): string => {
      const zoned = parseISO(iso_dt);
      const offset = zoned.getTimezoneOffset() / 60;

      return addHours(zoned, -(offset + 3)).toISOString();
    };

    const date = parseISO(values["dealDate"]);
    const time = parseISO(values["dealTime"]);

    const dateTime = new Date(
      `${format(date, "yyyy-MM-dd")}T${format(time, "HH:mm")}`
    ).toISOString();

    const deal = {
      accountId: values["dealAccount"],
      number: parseInt(values["dealNumber"]),
      operation: parseInt(values["dealOperation"]),
      securityId: values["dealSecurity"],
      date: toMSK(dateTime),
      deliveryDate: toMSK(values["deliveryDate"]),
      price: parseFloat(values["dealPrice"]),
      count: parseInt(values["dealCount"]),
      volume: parseFloat(values["dealVolume"]),
      nkd: parseFloat(values["dealNkd"]),
    };

    this.props.postDeal(deal);
  };

  public render() {
    return (
      <Paper>
        <DealForm onSubmit={this.submit} />
      </Paper>
    );
  }
}

let dealForm = reduxForm({
  // a unique name for the form
  form: "deal",
})(DealCreate as any);

export default connect(
  (state: ApplicationState) => ({
    securities: state.securities?.securities,
    accounts: state.accounts?.accounts,
  }),
  (dispatch) =>
    bindActionCreators(
      {
        requestSecurities: SecuritiesStore.actionCreators.requestSecurities,
        postDeal: DealStore.actionCreators.postDeal,
      },
      dispatch
    )
)(withStyles(styles)(dealForm as any));
