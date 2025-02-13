import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import Dropdown from "../dropdown";

import { ApplicationState } from "../../store";

import * as PositionsStore from "../../store/Positions";
import * as AccountsStore from "../../store/Accounts";
import PositionsGrid from "./PositionsGrid";
import DetailsGrid from "./DetailsGrid";

type PositionsProps = PositionsStore.PositionsState &
  AccountsStore.AccountsState &
  typeof PositionsStore.actionCreators;

class Positions extends React.PureComponent<PositionsProps> {
  constructor(props: PositionsProps) {
    super(props);

    this.handleAccountChange = this.handleAccountChange.bind(this);
  }

  public componentDidUpdate() {
    this.props.requestPositions(this.props.accountId);
  }

  handleAccountChange(option: any) {
    this.props.changeFilter({
      accountId: option.id as number,
    });
  }

  private onOpen(selectedRows: any[]) {
    this.props.requestPositionDetails(
      selectedRows[0].isin,
      this.props.accountId
    );
  }

  public render() {
    const positionsConfig = {
      columns: [
        {
          field: "code",
          headerName: "code",
          width: 50,
        },
        {
          field: "isin",
          headerName: "isin",
          width: 100,
        },
        {
          field: "name",
          headerName: "name",
          width: 150,
        },
        {
          field: "limit",
          headerName: "limit",
          width: 150,
        },
      ],
    };

    const detailsConfig = {
      columns: [
        {
          field: "isin",
          headerName: "isin",
          width: 50,
        },
        {
          field: "date",
          headerName: "date",
          width: 150,
        },
        {
          field: "limit",
          headerName: "limit",
          width: 150,
        },
        {
          field: "price",
          headerName: "price",
          width: 150,
        },
      ],
    };

    const positionsProps = {
      keyField: "isin",
      gridConfig: positionsConfig,
      items: this.props.positions,
      onSelectionChanged: this.onOpen.bind(this),
    };

    const detailsProps = {
      //keyField: "code",
      gridConfig: detailsConfig,
      items: this.props.positionDetails,
    };

    return (
      <React.Fragment>
        <div className="filterPanel">
          <h4 className="title">Accounts</h4>

          <div style={{ width: 200 }}>
            <Dropdown
              options={this.props.accounts}
              id="id"
              label="name"
              prompt="Select account..."
              value={this.props.accounts.find(
                (a) => a.id === this.props.accountId
              )}
              onChange={(val) => this.handleAccountChange(val)}
            />
          </div>
        </div>

        <div style={{ height: 300 }}>
          {this.props.isLoading === false && (
            <PositionsGrid {...positionsProps} />
          )}
        </div>

        <div style={{ height: 500 }}>
          <DetailsGrid {...detailsProps} />
        </div>
      </React.Fragment>
    );
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators(PositionsStore.actionCreators, dispatch);
};

export default connect(
  (state: ApplicationState) => ({ ...state.positions, ...state.accounts }),
  mapDispatchToProps
)(Positions as any);
