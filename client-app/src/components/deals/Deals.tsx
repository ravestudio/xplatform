import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import { Paper, Button } from '@material-ui/core'
import { ApplicationState } from '../../store'
import * as DealsStore from '../../store/Deals'
import * as SecuritiesStore from '../../store/Securities'
import * as AccountsStore from '../../store/Accounts'

import EditDealDialog from './EditDealDialog'

import { format, parseISO } from 'date-fns'

interface OperationProps {
    operations: any[]
}

type DealsProps =
    DealsStore.DealsState
    & SecuritiesStore.SecuritiesState
    & AccountsStore.AccountsState
    & OperationProps
    & typeof DealsStore.actionCreators
    & typeof SecuritiesStore.actionCreators

interface IState {
    editOpen: boolean;
}

class Deals extends React.PureComponent<DealsProps, IState> {
    constructor(props: DealsProps) {
        super(props)

        this.state = { editOpen: false }

        this.handleClickEdit = this.handleClickEdit.bind(this)
    }

    public componentDidMount() {
        this.props.requestSecurities();
        this.props.requestDeals();
    }

    getAccount(accountId: number): string | undefined {
        return this.props.accounts.find(a => a.id === accountId)?.name
    }

    getOperation(operationId: number): string | undefined {
        return this.props.operations.find(o => o.id === operationId)?.name
    }

    getSecurity(securityId: number): string | undefined {
        return this.props.securities.find(s => s.id === securityId)?.name
    }

    handleClickEdit() {
        this.setState((state) => ({ ...state, editOpen: true }))
    }

    public render() {

        return (
            <React.Fragment>
                <EditDealDialog
                    open={this.state.editOpen}
                    securities={this.props.securities}
                    accounts={this.props.accounts}
                />
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Number</TableCell>
                                <TableCell align="right">Account</TableCell>
                                <TableCell align="right">Security</TableCell>
                                <TableCell align="right">Operation</TableCell>
                                <TableCell align="right">Date</TableCell>
                                <TableCell align="right">Price</TableCell>
                                <TableCell align="right">Count</TableCell>
                                <TableCell align="right">Volume</TableCell>
                                <TableCell align="right">NKD</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.props.deals.map((deal: DealsStore.Deal) => (
                                <TableRow key={deal.id}>
                                    <TableCell component="th" scope="row">{deal.number}</TableCell>
                                    <TableCell align="right">{this.getAccount(deal.accountId)}</TableCell>
                                    <TableCell align="right">{this.getSecurity(deal.securityId) || 'loading...'}</TableCell>
                                    <TableCell align="right">{this.getOperation(deal.operation)}</TableCell>
                                    <TableCell align="right">{format(parseISO(deal.date), 'dd/MM/yyyy')}</TableCell>
                                    <TableCell align="right">{deal.price}</TableCell>
                                    <TableCell align="right">{deal.count}</TableCell>
                                    <TableCell align="right">{deal.volume}</TableCell>
                                    <TableCell align="right">{deal.nkd}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Button variant="contained" color="primary" onClick={this.handleClickEdit}>Add Deal</Button>
            </React.Fragment>
        )
    }

}

export default connect(
    (state: ApplicationState) => ({
        deals: state.deals?.deals,
        securities: state.securities?.securities,
        isLoading: state.deals?.isLoading,
        accounts: state.accounts?.accounts,
        operations: [{
            id: 1,
            name: "Buy"
        },
        {
            id: 2,
            name: "Sell"
        }]
    }),
    (dispatch) => bindActionCreators({
        requestDeals: DealsStore.actionCreators.requestDeals,
        requestSecurities: SecuritiesStore.actionCreators.requestSecurities
    }, dispatch)
)(Deals as any);

//export default connect<DealsProps>(mapStateToProps)(Deals)