import * as React from "react";
import { connect } from "react-redux";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

interface EmitentsProps {
  emitents: Array<any>;
}

const Emitents: React.FC<EmitentsProps> = (props) => (
  <TableContainer component={Paper}>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Emitent</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {props.emitents.map((em) => (
          <TableRow key={em.name}>
            <TableCell component="th" scope="row">
              {em.name}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

const mapStateToProps = (state: any): EmitentsProps => ({
  emitents: [
    {
      code: "GAZP",
      name: "Gazprom",
    },
    {
      code: "LKOH",
      name: "Lukoil",
    },
  ],
});

export default connect<EmitentsProps>(mapStateToProps)(Emitents);
