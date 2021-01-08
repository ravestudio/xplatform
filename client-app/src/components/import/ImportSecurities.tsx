import React from "react";
import { connect } from "react-redux";
import clsx from "clsx";

import {
  Button,
  createStyles,
  Theme,
  withStyles,
  WithStyles,
} from "@material-ui/core";

import { CellClassParams, ColDef, DataGrid } from "@material-ui/data-grid";

import { ApplicationState } from "../../store";
import * as ImportStore from "../../store/Import";
import { type } from "os";
import { bindActionCreators, compose } from "redux";

interface IState {
  selected: string[];
}

const styles = (theme: Theme) =>
  createStyles({
    root: {
      "& .super-app.negative": {
        backgroundColor: "#d47483",
        color: "#1a3e72",
        fontWeight: "600",
      },
      "& .super-app.positive": {
        backgroundColor: "rgba(157, 255, 118, 0.49)",
        color: "#1a3e72",
        fontWeight: "600",
      },
    },
  });

type IDispatchProps = typeof ImportStore.actionCreators;

type ImportProps = ImportStore.ImportState &
  WithStyles<typeof styles> &
  IDispatchProps;

const columns: ColDef[] = [
  { field: "ticker", headerName: "Ticker", width: 80 },
  { field: "isin", headerName: "ISIN", width: 140 },
  { field: "currency", headerName: "Currency", width: 80 },
  { field: "name", headerName: "Name", width: 330 },
  { field: "board", headerName: "Board", width: 100 },
  { field: "emitent", headerName: "Emitent", width: 100 },
  {
    field: "processed",
    headerName: "Processed",
    width: 100,
    cellClassName: (params: CellClassParams) =>
      clsx("super-app", {
        negative: (params.value as boolean) === false,
        positive: (params.value as boolean) === true,
      }),
  },
];

class ImportSecurities extends React.Component<ImportProps, IState> {
  constructor(props: ImportProps) {
    super(props);

    this.state = {
      selected: [],
    };

    this.ImportSelected = this.ImportSelected.bind(this);
  }

  public componentDidMount() {
    if (this.props.importType !== undefined) {
      this.props.RequestDataAction(this.props.importType);
    }
  }

  private ImportSelected() {
    this.props.ImportDataAction(this.state.selected);
  }

  public render() {
    return (
      <React.Fragment>
        {this.props.isLoading && <span>Loading...</span>}

        {this.props.isLoading === false && (
          <div
            style={{ height: 520, width: "100%", backgroundColor: "white" }}
            className={this.props.classes.root}
          >
            <DataGrid
              rows={this.props.securities}
              columns={columns}
              pageSize={15}
              checkboxSelection
              onSelectionChange={(newSelection) => {
                this.setState({
                  selected: newSelection.rowIds as string[],
                });
              }}
            />
          </div>
        )}

        <div>
          <Button
            variant="contained"
            color="primary"
            onClick={this.ImportSelected}
          >
            Import Selected
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

const styled = withStyles(styles)(ImportSecurities);

export default connect(
  (state: ApplicationState) => state.import,

  mapDispatchToProps
)(styled);
