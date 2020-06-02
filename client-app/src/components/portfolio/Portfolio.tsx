import React from 'react'
import { connect } from 'react-redux';
import { ApplicationState } from '../../store';
import * as PortfolioStore from '../../store/Portfolio';
import { spawn } from 'child_process';

type PortfolioProps =
    PortfolioStore.PortfolioState
    & typeof PortfolioStore.actionCreators

class Portfolio extends React.PureComponent<PortfolioProps> {

    public componentDidMount() {
        this.props.requestPortfolio("common");
    }


    public componentDidUpdate() {
        this.props.requestPortfolio("common");
    }

    public render() {
        return (
            <React.Fragment>
                <h1>Portfolio</h1>
                {this.props.isLoading && <span>Loading...</span>}
                {this.renderPortfolioTable()}
                {!this.props.isLoading && this.renderSummary()}

            </React.Fragment>
        );
    }

    private renderSummary() {
        return (
            <React.Fragment>
                <div>{`Shares total: ${this.props.portfolio?.sharesPerc}%`}</div>
                <div>{`Bonds total: ${this.props.portfolio?.bondsPerc}%`}</div>
            </React.Fragment>
        )
    }

    private renderPortfolioTable() {
        return (
            <table>
                <thead>
                    <tr>
                        <th>Code</th>
                        <th>Name</th>
                        <th>Limit</th>
                        <th>Cost</th>
                    </tr>
                </thead>
                <tbody>
                    {this.props.portfolio?.items.map((item: PortfolioStore.PortfolioItem) =>
                        <tr key={item.code}>
                            <td>{item.code}</td>
                            <td>{item.name}</td>
                            <td>{item.limit}</td>
                            <td>{item.cost}</td>
                        </tr>
                    )}
                    <tr>
                        <td>Total</td>
                        <td></td>
                        <td></td>
                        <td>{this.props.portfolio && this.props.portfolio?.sharesTotal + this.props.portfolio?.bondsTotal}</td>
                    </tr>

                </tbody>
            </table>
        );
    }
}

export default connect(
    (state: ApplicationState) => state.portfolio,
    PortfolioStore.actionCreators
)(Portfolio as any);