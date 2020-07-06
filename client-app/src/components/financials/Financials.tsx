import React from 'react'
import { connect } from 'react-redux';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import { ApplicationState } from '../../store';
import * as FinancialsStore from '../../store/Financials';

type FinancialsProps =
    FinancialsStore.FinancialsState
    & typeof FinancialsStore.actionCreators

interface IState {
    activeTab: number;
}

interface TabPanelProps {
    children?: React.ReactNode;
    index: any;
    value: any;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {children}
        </div>
    );
}

class Financials extends React.PureComponent<FinancialsProps, IState> {

    constructor(props: FinancialsProps) {
        super(props)

        this.state = { activeTab: 0 }

        this.handleChange = this.handleChange.bind(this)
    }

    public componentDidMount() {
        this.props.requestFinancials();
    }

    private handleChange (event: React.ChangeEvent<{}>, newValue: number) {
        this.setState((state) => ({ ...state, activeTab: newValue }))
    };

    public render() {
        return (
            <React.Fragment>
                <h1>Financials</h1>

                <Tabs value={this.state.activeTab} onChange={this.handleChange} aria-label="simple tabs example">
                    <Tab label="Incomes" />
                    <Tab label="Cash Flow" />
                    <Tab label="Item Three" />
                </Tabs>

                {this.props.isLoading && <span>Loading...</span>}

                <TabPanel value={this.state.activeTab} index={0}>
                    {this.renderIncomesTable()}
                </TabPanel>

                <TabPanel value={this.state.activeTab} index={1}>
                    {this.renderFlowsTable()}
                </TabPanel>
                
            </React.Fragment>
        );
    }

    private renderFlowsTable() {
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
                        <td>Depreciation</td>
                        {this.props.financials?.cashflowStatementHistory.map((inc: any, index: number) => <td key={index}>{inc.depreciation.raw}</td>)}
                    </tr>
                </tbody>
            </table>
        )
    }

    private renderIncomesTable() {
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
                    <tr>
                        <td>Total Operating Expenses</td>
                        {this.props.financials?.incomeStatementHistory.map((inc: any, index: number) => <td key={index}>{inc.totalOperatingExpenses.raw}</td>)}
                    </tr>
                    <tr>
                        <td>Net Income</td>
                        {this.props.financials?.incomeStatementHistory.map((inc: any, index: number) => <td key={index}>{inc.netIncome.raw}</td>)}
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