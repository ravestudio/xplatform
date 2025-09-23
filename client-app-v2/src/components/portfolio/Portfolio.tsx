import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { ApplicationState } from "../../store";
import * as PortfolioStore from "../../store/Portfolio";

import Dropdown from "../dropdown";

import style from "./Portfolio.module.css";
import { AccessorKeyColumnDef } from "@tanstack/react-table";
import { TanstackTable } from "../../shared/TanstackTable/";

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
          <div className={style.filterPanel}>
            <h4 className={style.title}>Портфели</h4>

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

    const data = this.props.portfolio?.items;

    //const columnHelper = createColumnHelper<PortfolioStore.PortfolioItem>();
    //const cc = columnHelper.accessor("cost", {cell: info => info.getValue().toFixed(2)})

    const columns: AccessorKeyColumnDef<PortfolioStore.PortfolioItem>[] = [
      {
        accessorKey: "code",
        header: "Code",
        cell: (info) => info.getValue(),
        size: 80,
      },
      {
        accessorKey: "name",
        header: "Name",
        cell: (info) => info.getValue(),
        size: 350,
      },
      {
        accessorKey: "limit",
        header: "Limit",
        cell: (info) => info.getValue(),
        size: 80,
      },
      {
        accessorKey: "cost",
        header: "Cost",
        cell: (info) => info.getValue<number>().toFixed(2),
        footer: ({ table }) => {
          const totalAmount = table
            .getFilteredRowModel()
            .rows.reduce((sum, row) => sum + row.getValue<number>("cost"), 0);
          return `${totalAmount.toFixed(2)} (${total.toFixed(2)})`;
        },
        size: 150,
      },
      {
        id: "prc",
        accessorKey: "cost",
        header: "Prc",
        cell: (info) => this.RenderPrc(total, info.getValue<number>()),
        size: 30,
      },
    ];

    if (!data) {
      return null;
    }

    return <TanstackTable columns={columns} tableData={data} />;
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators(PortfolioStore.actionCreators, dispatch);
};

export default connect(
  (state: ApplicationState) => state.portfolio,
  mapDispatchToProps
)(Portfolio as any);
