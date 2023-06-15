import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { ApplicationState } from "../../store";
import * as PortfolioStore from "../../store/Portfolio";

import Dropdown from "../dropdown";

import "./Portfolio.scss";

type PortfolioProps = PortfolioStore.PortfolioState &
  typeof PortfolioStore.actionCreators;

class Portfolio extends React.PureComponent<PortfolioProps> {
  constructor(props: PortfolioProps) {
    super(props);

    this.handlePortfolioChange = this.handlePortfolioChange.bind(this);
  }

  public componentDidMount() {
    //this.props.requestPortfolio("common");

    this.props.requestPortfolioList();
  }

  public componentDidUpdate() {
    if (this.props.portfolioId) {
      this.props.requestPortfolio("common", this.props.portfolioId);
    }
  }

  handlePortfolioChange(option: any) {
    this.props.changeFilter({ portfolioId: option.id as string });
  }

  public render() {
    return (
      <React.Fragment>
        <h1>Portfolio</h1>
        {this.props.isLoading && <span>Loading...</span>}

        {this.props.portfolioList && (
          <div className="filterPanel">
            <h4 className="title">Портфели</h4>

            <div style={{ width: 200 }}>
              <Dropdown
                options={this.props.portfolioList}
                id="id"
                label="name"
                prompt="Select portfolio..."
                value={this.props.portfolioList?.find(
                  (port) => port.id === this.props.portfolioId
                )}
                onChange={(val) => this.handlePortfolioChange(val)}
              />
            </div>
          </div>
        )}

        {this.renderPortfolioTable()}
        {!this.props.isLoading && this.renderSummary()}
      </React.Fragment>
    );
  }

  private renderSummary() {
    return (
      <React.Fragment>
        <div>{`Shares total: ${this.props.portfolio?.sharesPerc}%`}</div>
        <div>{`Bonds total: ${this.props.portfolio?.bondsPerc}%`}</div>
      </React.Fragment>
    );
  }

  private RenderPrc(total: number, cost: number) {
    return ((cost / total) * 100).toFixed(2);
  }

  private renderPortfolioTable() {
    const total = this.props.portfolio
      ? this.props.portfolio?.sharesTotal + this.props.portfolio?.bondsTotal
      : 0;

    return (
      <table>
        <thead>
          <tr>
            <th>Code</th>
            <th>Name</th>
            <th>Limit</th>
            <th>Cost</th>
            <th>Prc</th>
          </tr>
        </thead>
        <tbody>
          {this.props.portfolio?.items.map(
            (item: PortfolioStore.PortfolioItem) => (
              <tr key={item.code}>
                <td>{item.code}</td>
                <td>{item.name}</td>
                <td>{item.limit}</td>
                <td>{item.cost.toFixed(2)}</td>
                <td>{this.RenderPrc(total, item.cost)}</td>
              </tr>
            )
          )}
          <tr>
            <td>Total</td>
            <td></td>
            <td></td>
            <td>{total.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>
    );
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators(PortfolioStore.actionCreators, dispatch);
};

export default connect(
  (state: ApplicationState) => state.portfolio,
  mapDispatchToProps
)(Portfolio as any);
