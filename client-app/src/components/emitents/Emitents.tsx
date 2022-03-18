import * as React from "react";
import { connect } from "react-redux";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

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
