import React from 'react'
import { connect } from 'react-redux';

import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'

import { ApplicationState } from '../../store';
import * as SharesStore from '../../store/Shares';

type SharesProps =
    SharesStore.SharesState
    & typeof SharesStore.actionCreators

class Shares extends React.PureComponent<SharesProps> {

    public componentDidMount() {
        this.props.requestShareInfo();
    }


    public render() {
        return (
            <React.Fragment>
                <h1>Shares</h1>
                {this.props.isLoading && <span>Loading...</span>}
                {this.renderPortfolioTable()}
            </React.Fragment>
        );
    }

    priceColor(change: number | undefined): string {

        if (change === undefined || change > 0) {
            return 'green'
        }

        return 'red'
    }

    private renderPortfolioTable() {
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
                        {this.props.shares.map(sh => (
                            <TableRow key={sh.code}>
                                <TableCell component="th" scope="row">{sh.code}</TableCell>
                                <TableCell>{sh.emitent}</TableCell>
                                <TableCell align="right">{sh.price}</TableCell>
                                <TableCell>{sh.currency}</TableCell>
                                <TableCell align="right" style={{ color: this.priceColor(sh.priceChange)}}>{sh.priceChange}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        )
    }
}

export default connect(
    (state: ApplicationState) => state.shares,
    SharesStore.actionCreators
)(Shares as any);