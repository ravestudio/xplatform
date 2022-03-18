import React from "react";

import clsx from "clsx";

import {
  Button,
  createStyles,
  Theme,
  withStyles,
  WithStyles,
} from "@mui/material";

import {
  CellClassParams,
  ColDef,
  DataGrid,
  SelectionChangeParams,
  ValueGetterParams,
} from "@material-ui/data-grid";

import * as ImportStore from "../../store/Import";
import { format, parseISO } from "date-fns";

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
  { field: "code", headerName: "Ticker", width: 80 },
  { field: "name", headerName: "Name", width: 330 },
  {
    field: "loadDate",
    headerName: "Load Date",
    type: "date",
    /*valueGetter: (params: ValueGetterParams) => {
      return format(parseISO(params.value as string), "dd/MM/yyyy");
    },*/
    width: 200,
  },
  {
    field: "lastFinance",
    headerName: "Last Finance",
    type: "date",
    /*valueGetter: (params: ValueGetterParams) => {
      return format(parseISO(params.value as string), "dd/MM/yyyy");
    },*/
    width: 200,
  },
  {
    field: "status",
    headerName: "Status",
    width: 100,
    cellClassName: (params: CellClassParams) =>
      clsx("super-app", {
        negative: params.value && (params.value as string) !== "Processed",
        positive: (params.value as string) === "Processed",
      }),
  },
];

interface IProps {
  financials: ImportStore.YahooFinancial[];
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
          rows={props.financials}
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
