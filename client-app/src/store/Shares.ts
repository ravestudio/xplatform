import { Action, Reducer } from 'redux'
import { AppThunkAction } from './';
import C from "../constants"
import { request } from 'https';

export interface SharesState {
    isLoading: boolean
    shares: ShareInfo[]
}

export interface ShareInfo {
    code: string,
    emitent: string,
    currency: string,
    price?: number,
    priceChange?: number
}

export interface PriceValues {
    code: string;
    lastPrice: number;
    change: number
}

interface RequestShareInfoAction {
    type: 'SHARESINFO_REQUEST'
}

interface ReceiveShareInfoAction {
    type: 'SHARESINFO_RECEIVE',
    shares: ShareInfo[]
}


type KnownAction = RequestShareInfoAction | ReceiveShareInfoAction;

export const actionCreators = {
    requestShareInfo: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const appState = getState();

        fetch(`${C.apiUrl}/sharesInfo`)
            .then(response => response.json() as Promise<ShareInfo[]>)
            .then(data => {
                dispatch({ type: 'SHARESINFO_RECEIVE', shares: data });
            });

        dispatch({ type: 'SHARESINFO_REQUEST' });
    }
};

const unloadedState: SharesState = {
    shares: [], isLoading: false
};

export const reducer: Reducer<SharesState> = (state: SharesState | undefined, incomingAction: Action): SharesState => {
    if (state === undefined) {
        return unloadedState;
    }

    const action = incomingAction as KnownAction

    switch (action.type) {
        case 'SHARESINFO_REQUEST':
            return { ...state, isLoading: true }
        case 'SHARESINFO_RECEIVE':
            return {
                shares: action.shares,
                isLoading: false
            }
        default: return state
    }
}