import React from "react";

import clsx from "clsx";

import {
  Button,
  createStyles,
  Theme,
  withStyles,
  WithStyles,
} from "@material-ui/core";

import {
  CellClassParams,
  ColDef,
  DataGrid,
  SelectionChangeParams,
} from "@material-ui/data-grid";

import * as ImportStore from "../../store/Import";

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

interface IProps {
  securities: ImportStore.Security[];
  onSelectionChange: (keys: string[]) => void;
}

type ImportProps = IProps & WithStyles<typeof styles>;

const Securities: React.FC<ImportProps> = (props) => {
  const selectionChange = (prs: SelectionChangeParams) => {
    props.onSelectionChange(prs.rowIds as string[]);
  };

  return (
    <React.Fragment>
      <div
        style={{ height: 520, width: "100%", backgroundColor: "white" }}
        className={props.classes.root}
      >
        <DataGrid
          rows={props.securities}
          columns={columns}
          pageSize={15}
          checkboxSelection
          onSelectionChange={selectionChange}
        />
      </div>
    </React.Fragment>
  );
};

export const styled = withStyles(styles)(Securities);
