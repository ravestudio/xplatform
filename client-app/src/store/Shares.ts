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
    price?: number,
    change?: number
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

interface ReceivePriceAction {
    type: 'PRICE_RECEIVE',
    priceValues: PriceValues[]
}

type KnownAction = RequestShareInfoAction | ReceiveShareInfoAction | ReceivePriceAction;

export const actionCreators = {
    requestShareInfo: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const appState = getState();

        fetch(`${C.apiUrl}/sharesInfo`)
            .then(response => response.json() as Promise<ShareInfo[]>)
            .then(data => {
                dispatch({ type: 'SHARESINFO_RECEIVE', shares: data });
            });

        dispatch({ type: 'SHARESINFO_REQUEST' });
    },

    requestPriceValues: (): AppThunkAction<KnownAction> => (dispatch) => {

        fetch(`${C.apiUrl}/Price`)
            .then(response => response.json() as Promise<PriceValues[]>)
            .then(data => {

                dispatch({ type: 'PRICE_RECEIVE', priceValues: data });


            });
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
        case 'PRICE_RECEIVE':

            const newState: SharesState = { shares: [], isLoading: false }

            state.shares.map((share: ShareInfo) => {

                const price = action.priceValues.find(p => p.code === share.code)

                newState.shares.push({ ...share, price: price?.lastPrice, change: price?.change })
            })

            return newState
        default: return state
    }
}