import React from "react";
import { connect } from "react-redux";
import clsx from "clsx";

import {
  Button,
  createStyles,
  FormControl,
  MenuItem,
  Select,
  Theme,
  withStyles,
  WithStyles,
} from "@material-ui/core";

import { CellClassParams, ColDef, DataGrid } from "@material-ui/data-grid";

import { ApplicationState } from "../../store";
import * as ImportStore from "../../store/Import";
import { styled as Securities } from "./Securities";
import { styled as Financials } from "./Financials";
import { bindActionCreators, compose } from "redux";

interface IState {
  selected: string[];
}

type IDispatchProps = typeof ImportStore.actionCreators;

type ImportProps = ImportStore.ImportState & IDispatchProps;

class ImportSecurities extends React.Component<ImportProps, IState> {
  constructor(props: ImportProps) {
    super(props);

    this.state = {
      selected: [],
    };

    this.ImportSelected = this.ImportSelected.bind(this);
    this.ProcessSelected = this.ProcessSelected.bind(this);

    this.handleImportTypeChange = this.handleImportTypeChange.bind(this);
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
    this.props.ProcessData(this.state.selected);
  }

  private handleImportTypeChange(event: React.ChangeEvent<{ value: unknown }>) {
    this.props.RequestDataAction(event.target.value as string);
  }

  public render() {
    return (
      <React.Fragment>
        <div>
          <FormControl>
            <Select
              value={this.props.importType}
              onChange={this.handleImportTypeChange}
              displayEmpty
              inputProps={{ "aria-label": "Without label" }}
            >
              <MenuItem value={"stock"}>Stocks</MenuItem>
              <MenuItem value={"financial"}>Yahoo Finance</MenuItem>
            </Select>
          </FormControl>
        </div>

        {this.props.isLoading && <span>Loading...</span>}

        {this.props.isLoading === false && this.props.importType == "stock" && (
          <Securities
            securities={this.props.securities}
            onSelectionChange={(newSelection) => {
              this.setState({
                selected: newSelection,
              });
            }}
          />
        )}

        {this.props.isLoading === false &&
          this.props.importType == "financial" && (
            <Financials
              financials={this.props.yahooFinancials}
              onSelectionChange={(newSelection) => {
                this.setState({
                  selected: newSelection,
                });
              }}
            />
          )}

        <div>
          <Button
            variant="contained"
            color="primary"
            onClick={this.ImportSelected}
          >
            Import Selected
          </Button>

          <Button
            variant="contained"
            color="primary"
            onClick={this.ProcessSelected}
          >
            Process Selected
          </Button>

          <Button color="primary" onClick={this.props.RefreshList}>
            Refresh List
          </Button>
        </div>

        {this.state.selected.map((item) => (
          <div>{item}</div>
        ))}
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
)(ImportSecurities);
