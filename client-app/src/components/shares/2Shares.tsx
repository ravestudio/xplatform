import React from "react";
import { connect } from "react-redux";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

import Link from "@material-ui/core/Link";

import {
  createStyles,
  Theme,
  WithStyles,
  withStyles,
} from "@material-ui/core/styles";

import { ApplicationState } from "../../store";
import * as SharesStore from "../../store/Shares";

import withWidth, { WithWidthProps } from "@material-ui/core/withWidth";

import Dropdown from "../dropdown";
import countries from "../dropdown/countries.json";

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
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Code</TableCell>
              <TableCell>Emitent</TableCell>
              <TableCell align="right">Price</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.props.shares.map((sh) => (
              <TableRow key={sh.code}>
                <TableCell component="th" scope="row">
                  {sh.code}
                </TableCell>
                <TableCell>{sh.emitent}</TableCell>
                <TableCell
                  align="right"
                  style={{ color: this.priceColor(sh.priceChange) }}
                >
                  {sh.price}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  private renderSharesTable() {
    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Code</TableCell>
              <TableCell>Emitent</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell>Currency</TableCell>
              <TableCell align="right">Change (%)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.props.shares.map((sh) => (
              <TableRow key={sh.code}>
                <TableCell component="th" scope="row">
                  {sh.code}
                </TableCell>
                <TableCell>
                  {sh.financialPage ? (
                    <Link
                      href={`financials/${sh.financialPage}`}
                      color="inherit"
                      underline="always"
                    >
                      {sh.emitent}
                    </Link>
                  ) : (
                    sh.emitent
                  )}
                </TableCell>
                <TableCell align="right">{sh.price}</TableCell>
                <TableCell>{sh.currency}</TableCell>
                <TableCell
                  align="right"
                  style={{ color: this.priceColor(sh.priceChange) }}
                >
                  {sh.priceChange}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }
}

export default compose(
  withWidth(),
  withStyles(styles),
  connect((state: ApplicationState) => state.shares, SharesStore.actionCreators)
)(Shares as any);
