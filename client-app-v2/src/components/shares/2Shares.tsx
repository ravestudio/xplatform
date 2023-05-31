import React from "react";
import { connect } from "react-redux";

import { Link } from "react-router-dom";

import { ApplicationState } from "../../store";
import * as SharesStore from "../../store/Shares";

import Dropdown from "../dropdown";

import { compose } from "recompose";

import "./Shares.scss";

const regions = [
  {
    value: "Moscow",
    name: "Moscow",
  },
  {
    value: "United States",
    name: "United States",
  },
  {
    value: "China",
    name: "China",
  },
];

type SharesProps = SharesStore.SharesState & typeof SharesStore.actionCreators;

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

        <div className="filterPanel">
          <h4 className="title">Shares</h4>

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

        {this.renderSharesTable()}
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
            <th>Sector</th>
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
              <td align="right">{sh.sector}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
}

export default compose(
  connect((state: ApplicationState) => state.shares, SharesStore.actionCreators)
)(Shares as any);
