import React from 'react'
import { connect } from 'react-redux';
import { ApplicationState } from '../../store';
import * as FinancialsStore from '../../store/Financials';

type FinancialsProps =
    FinancialsStore.FinancialsState
    & typeof FinancialsStore.actionCreators

class Financials extends React.PureComponent<FinancialsProps> {

    public componentDidMount() {
        this.props.requestFinancials();
    }

    public render() {
        return (
            <React.Fragment>
                <h1>Financials</h1>
                {this.props.isLoading && <span>Loading...</span>}
                {this.renderFinancialTable()}
            </React.Fragment>
        );
    }

    private renderFinancialTable() {
        return (
            <table>
                <thead>
                    <tr>
                        <th>Breakdown</th>
                        {this.props.financials?.years.map((year: number) => <th key={year}>{year}</th>)}
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Total Revenue</td>
                        {this.props.financials?.incomeStatementHistory.map((inc: any, index: number) => <td key={index}>{inc.totalRevenue.raw}</td>)}
                    </tr>
                    <tr>
                        <td>Cost of Revenue</td>
                        {this.props.financials?.incomeStatementHistory.map((inc: any, index: number) => <td key={index}>{inc.costOfRevenue.raw}</td>)}
                    </tr>
                </tbody>
            </table>
        );
    }
}

export default connect(
    (state: ApplicationState) => state.financials,
    FinancialsStore.actionCreators
)(Financials as any);