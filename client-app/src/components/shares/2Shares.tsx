import React from "react";
import { connect } from "react-redux";

import Typography from "@mui/material/Typography";

import { Link } from "react-router-dom";

import { createStyles, Theme, withStyles, WithStyles } from "@mui/styles";

import { ApplicationState } from "../../store";
import * as SharesStore from "../../store/Shares";

import withWidth, { WithWidthProps } from "@mui/material";

import Dropdown from "../dropdown";

import { compose } from "recompose";

const styles = (theme: Theme) =>
  createStyles({
    title: {
      flexGrow: 1,
    },

    filterPanel: {
      display: "flex",
      margin: "10px 0 10px 0",
    },

    formControl: {
      //margin: theme.spacing(1),
      minWidth: 120,
    },
  });

const regions = [
  {
    value: "Moscow",
    name: "Moscow",
  },
  {
    value: "United States",
    name: "United States",
  },
];

type SharesProps = SharesStore.SharesState &
  WithWidthProps &
  WithStyles<typeof styles> &
  typeof SharesStore.actionCreators;

class Shares extends React.PureComponent<SharesProps> {
  constructor(props: SharesProps) {
    super(props);

    this.handleRegionChange = this.handleRegionChange.bind(this);
  }

  public componentDidMount() {
    if (this.props.region !== undefined) {
      this.props.requestShareInfo(this.props.region);
    }
  }

  handleRegionChange(option: any) {
    this.props.requestShareInfo(option.value as string);
  }

  public render() {
    return (
      <React.Fragment>
        {this.props.isLoading && <span>Loading...</span>}

        <div className={this.props.classes.filterPanel}>
          <Typography variant="h5" className={this.props.classes.title}>
            Shares
          </Typography>

          <div style={{ width: 200 }}>
            <Dropdown
              options={regions}
              id="value"
              label="name"
              prompt="Select region..."
              value={regions.find((reg) => reg.value === this.props.region)}
              onChange={(val) => this.handleRegionChange(val)}
            />
          </div>
        </div>

        {this.props.width === "xs"
          ? this.renderSharesTableShort()
          : this.renderSharesTable()}
      </React.Fragment>
    );
  }

  priceColor(change: number | undefined): string {
    if (change === undefined || change > 0) {
      return "green";
    }

    return "red";
  }

  private renderSharesTableShort() {
    return (
      <table className="xtable">
        <thead>
          <tr>
            <th>Code</th>
            <th>Emitent</th>
            <th align="right">Price</th>
          </tr>
        </thead>
        <tbody>
          {this.props.shares.map((sh) => (
            <tr key={sh.code}>
              <th>{sh.code}</th>
              <td>{sh.emitent}</td>
              <td
                align="right"
                style={{ color: this.priceColor(sh.priceChange) }}
              >
                {sh.price}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  private renderSharesTable() {
    return (
      <table className="xtable">
        <thead>
          <tr>
            <th>Code</th>
            <th>Emitent</th>
            <th align="right">Price</th>
            <th>Currency</th>
            <th align="right">Change (%)</th>
          </tr>
        </thead>
        <tbody>
          {this.props.shares.map((sh) => (
            <tr key={sh.code}>
              <th>{sh.code}</th>
              <td>
                {sh.financialPage ? (
                  <Link to={`financials/${sh.financialPage}`}>
                    {sh.emitent}
                  </Link>
                ) : (
                  sh.emitent
                )}
              </td>
              <td align="right">{sh.price}</td>
              <td>{sh.currency}</td>
              <td
                align="right"
                style={{ color: this.priceColor(sh.priceChange) }}
              >
                {sh.priceChange}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
}

export default compose(
  withWidth(),
  withStyles(styles),
  connect((state: ApplicationState) => state.shares, SharesStore.actionCreators)
)(Shares as any);
