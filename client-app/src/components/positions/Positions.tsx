import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import { ApplicationState } from "../../store";
import * as PositionsStore from "../../store/Positions";
import * as AccountsStore from "../../store/Accounts";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import Typography from "@mui/material/Typography";

import FormControl from "@mui/material/FormControl";
import {
  createStyles,
  Theme,
  WithStyles,
  withStyles,
} from "@mui/material/styles";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

import { compose } from "recompose";

const styles = (theme: Theme) =>
  createStyles({
    formControl: {
      //margin: theme.spacing(1),
      minWidth: 120,
    },
  });

function Row(props: {
  row: any;
  details: any;
  onOpen: (code: string) => void;
}) {
  const { row, details } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => {
              setOpen(!open);
              if (!open) {
                props.onOpen(row.code);
              }
            }}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.code}
        </TableCell>
        <TableCell align="right">{row.limit}</TableCell>
      </TableRow>

      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant="h6" gutterBottom component="div">
                History
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Code</TableCell>
                    <TableCell>Account</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell align="right">Price</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {details.map((item: any, index: number) => (
                    <TableRow key={index}>
                      <TableCell component="th" scope="row">
                        {item.date}
                      </TableCell>
                      <TableCell>{item.code}</TableCell>
                      <TableCell>{item.account}</TableCell>
                      <TableCell align="right">{item.limit}</TableCell>
                      <TableCell align="right">{item.price}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

type PositionsProps = PositionsStore.PositionsState &
  AccountsStore.AccountsState &
  WithStyles<typeof styles> &
  typeof PositionsStore.actionCreators;

class Positions extends React.PureComponent<PositionsProps> {
  constructor(props: PositionsProps) {
    super(props);

    this.onOpen = this.onOpen.bind(this);
    this.handleAccountChange = this.handleAccountChange.bind(this);
  }

  public componentDidMount() {
    this.props.requestPositions(this.props.accountId);
  }

  public componentDidUpdate() {
    this.props.requestPositions(this.props.accountId);
  }

  private onOpen(code: string) {
    this.props.requestPositionDetails(code, this.props.accountId);
  }

  handleAccountChange(event: React.ChangeEvent<{ value: unknown }>) {
    this.props.changeFilter({
      accountId: event.target.value as number,
    });
  }

  public render() {
    return (
      <React.Fragment>
        <h1>Positions</h1>

        <div>
          <FormControl className={this.props.classes.formControl}>
            <Select
              value={this.props.accountId}
              onChange={this.handleAccountChange}
              displayEmpty
              inputProps={{ "aria-label": "Without label" }}
            >
              <MenuItem value={undefined}>
                <em>None</em>
              </MenuItem>
              {this.props.accounts.map((item) => (
                <MenuItem value={item.id}>{item.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell align="right">Security</TableCell>
                <TableCell align="right">Limit</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.props.positions.map((row) => (
                <Row
                  key={row.code}
                  row={row}
                  details={this.props.positionDetails}
                  onOpen={this.onOpen}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </React.Fragment>
    );
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators(PositionsStore.actionCreators, dispatch);
};

export default compose(
  withStyles(styles),
  connect(
    (state: ApplicationState) => ({ ...state.positions, ...state.accounts }),
    mapDispatchToProps
  )
)(Positions as any);
