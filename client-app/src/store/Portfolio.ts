import { Action, Reducer } from 'redux';
import { AppThunkAction } from './';
import C from "../constants"

export interface PortfolioState {
    isLoading: boolean,
    viewType?: string,
    portfolio?: Portfolio
}

export interface Portfolio {
    items: PortfolioItem[],
    sharesTotal: number,
    bondsTotal: number,
    sharesPerc: number,
    bondsPerc: number
}

export interface PortfolioItem {
    code: string,
    name: string,
    limit: number,
    cost: number,
    market: string
}

interface RequestPortfolioAction {
    type: 'REQUEST_PORTFOLIO';
    viewType: string;
}

interface ReceivePortfolioAction {
    type: 'RECEIVE_PORTFOLIO';
    viewType: string;
    data: Portfolio;
}

type KnownAction = RequestPortfolioAction | ReceivePortfolioAction;

export const actionCreators = {
    requestPortfolio: (viewType: string): AppThunkAction<KnownAction> => (dispatch, getState) => {
        // Only load data if it's something we don't already have (and are not already loading)
        const appState = getState();
        if (appState && appState.portfolio && appState.portfolio.viewType !== viewType) {
            fetch(`${C.apiUrl}/portfolio`)
                .then(response => response.json() as Promise<Portfolio>)
                .then(data => {
                    dispatch({ type: 'RECEIVE_PORTFOLIO', data: data, viewType });
                });

            dispatch({ type: 'REQUEST_PORTFOLIO', viewType });
        }
    }
};


const unloadedState: PortfolioState = { isLoading: false };

export const reducer: Reducer<PortfolioState> = (state: PortfolioState | undefined, incomingAction: Action): PortfolioState => {
    if (state === undefined) {
        return unloadedState;
    }

    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'REQUEST_PORTFOLIO':
            return {
                viewType: action.viewType,
                isLoading: true
            };
        case 'RECEIVE_PORTFOLIO':
            return {
                portfolio: action.data,
                viewType: action.viewType,
                isLoading: false
            };
        default: return state
    }
};
