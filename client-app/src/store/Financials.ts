import { Action, Reducer } from 'redux';
import { AppThunkAction } from './';
import C from "../constants"

export interface FinancialsState {
    isLoading: boolean
    financials?: Financials
}

export interface Financials {
    incomeStatementHistory:any,
    years: number[]
}

interface RequestFinancialsAction {
    type: 'FINANCIALS_REQUEST'
}

interface ReceiveFinancialsAction {
    type: 'FINANCIALS_RECEIVE',
    financials: Financials
}

type KnownAction = RequestFinancialsAction | ReceiveFinancialsAction;

export const actionCreators = {
    requestFinancials: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const appState = getState();

        fetch(`${C.apiUrl}/yahoo/LKOH.ME`)
            .then(response => response.json() as Promise<Financials>)
            .then(data => {
                dispatch({ type: 'FINANCIALS_RECEIVE', financials: data });
            });
        dispatch({ type: 'FINANCIALS_REQUEST' });
    }
};

export const reducer: Reducer<FinancialsState> = (state: FinancialsState | undefined, incomingAction: Action): FinancialsState => {
    if (state === undefined) {
        return { isLoading: false };
    }

    const action = incomingAction as KnownAction

    switch (action.type) {
        case 'FINANCIALS_REQUEST':
            return { ...state, isLoading: true }
        case 'FINANCIALS_RECEIVE':
            return {
                financials: action.financials,
                isLoading: false
            }
        default: return state
    }
}