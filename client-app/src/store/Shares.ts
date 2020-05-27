import { Action, Reducer } from 'redux'
import { AppThunkAction } from './';
import C from "../constants"
import { request } from 'https';

export interface SharesState {
    isLoading: boolean,
    region?: string,
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
    type: 'SHARESINFO_REQUEST',
    region: string
}

interface ReceiveShareInfoAction {
    type: 'SHARESINFO_RECEIVE',
    region: string,
    shares: ShareInfo[]
}


type KnownAction = RequestShareInfoAction | ReceiveShareInfoAction;

export const actionCreators = {
    requestShareInfo: (region: string): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const appState = getState();

        //const region = 'United States'

        fetch(`${C.apiUrl}/sharesInfo?region=${region}`)
            .then(response => response.json() as Promise<ShareInfo[]>)
            .then(data => {
                dispatch({ type: 'SHARESINFO_RECEIVE', region: region, shares: data });
            });

        dispatch({ type: 'SHARESINFO_REQUEST', region: region });
    }
};

const unloadedState: SharesState = {
    region: 'Moscow',
    shares: [],
    isLoading: false
};

export const reducer: Reducer<SharesState> = (state: SharesState | undefined, incomingAction: Action): SharesState => {
    if (state === undefined) {
        return unloadedState;
    }

    const action = incomingAction as KnownAction

    switch (action.type) {
        case 'SHARESINFO_REQUEST':
            return {
                ...state,
                region: action.region,
                isLoading: true
            }
        case 'SHARESINFO_RECEIVE':
            return {
                region: action.region,
                shares: action.shares,
                isLoading: false
            }
        default: return state
    }
}