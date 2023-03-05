import React from "react";
import { connect } from "react-redux";

import Dropdown from "../dropdown";

import { ApplicationState } from "../../store";
import * as ImportStore from "../../store/Import";

import { bindActionCreators, compose } from "redux";
import Deals from "./Deals";
import Financials from "./Financials";
import Securities from "./Securities";

interface IState {
  selected: string[];
}

const importTypes = [
  {
    value: "stock",
    name: "Stocks",
  },
  {
    value: "financial",
    name: "Yahoo Finance",
  },
  {
    value: "deal",
    name: "Deals",
  },
];

type IDispatchProps = typeof ImportStore.actionCreators;

type ImportProps = ImportStore.ImportState & IDispatchProps;

class Import extends React.Component<ImportProps, IState> {
  constructor(props: ImportProps) {
    super(props);

    this.state = {
      selected: [],
    };

    this.ImportSelected = this.ImportSelected.bind(this);
    this.ProcessSelected = this.ProcessSelected.bind(this);

    this.handleImportTypeChange = this.handleImportTypeChange.bind(this);
    //this.onSelectionChanged = this.onSelectionChanged.bind(this);
  }

  public componentDidMount() {
    if (this.props.importType !== undefined) {
      this.props.RequestDataAction(this.props.importType);
    }
  }

  private ImportSelected() {
    if (this.props.importType === undefined) return;

    this.props.ImportDataAction(this.props.importType, this.state.selected);
  }

  private ProcessSelected() {
    if (this.props.importType === undefined) return;

    this.props.ProcessData(this.props.importType, this.state.selected);
  }

  handleImportTypeChange(option: any) {
    this.props.RequestDataAction(option.value as string);
  }

  onSelectionChanged(selectedRows: string[]) {
    this.setState({
      selected: selectedRows,
    });
  }

  public render() {
    const dealProps = {
      keyField: "number",
      items: this.props.deals,
    };

    const financialProps = {
      keyField: "id",
      items: this.props.yahooFinancials,
      onSelectionChanged: (rows: any[]) => {
        this.onSelectionChanged(rows.map((row: any) => row.id));
      },
    };

    const securitiesProps = {
      keyField: "id",
      items: this.props.securities,
      onSelectionChanged: (rows: any[]) => {
        this.onSelectionChanged(rows.map((row: any) => row.id));
      },
    };

    return (
      <React.Fragment>
        <div className="filterPanel">
          <h4 className="title">Imports</h4>

          <div style={{ width: 200 }}>
            <Dropdown
              options={importTypes}
              id="value"
              label="name"
              prompt="Select to import..."
              value={importTypes.find((t) => t.value === this.props.importType)}
              onChange={(val) => this.handleImportTypeChange(val)}
            />
          </div>
        </div>

        {this.props.isLoading && <span>Loading...</span>}

        <div style={{ height: 500 }}>
          {this.props.isLoading === false &&
            this.props.importType === "deal" && <Deals {...dealProps} />}

          {this.props.isLoading === false &&
            this.props.importType === "financial" && (
              <Financials {...financialProps} />
            )}

          {this.props.isLoading === false &&
            this.props.importType === "stock" && (
              <Securities {...securitiesProps} />
            )}
        </div>

        <div>
          <button onClick={this.ImportSelected}>Import Selected</button>

          <button onClick={this.ProcessSelected}>Process Selected</button>
        </div>
      </React.Fragment>
    );
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators(ImportStore.actionCreators, dispatch);
};

export default connect(
  (state: ApplicationState) => state.import,

  mapDispatchToProps
)(Import);
