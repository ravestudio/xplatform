import { Action, Reducer } from 'redux'
import { AppThunkAction } from './';

export interface SecuritiesState {
    isLoading: boolean
    securities: Security[]
}

export interface Security {
    id: number,
    name: string,
    type: string
}

export interface Share extends Security {

}

export interface Bond extends Security {
    nominalPrice: number
}

interface RequestSecurityAction {
    type: 'SECURITY_REQUEST'
}

interface ReceiveSecurityAction {
    type: 'SECURITY_RECEIVE',
    securities: Security[]
}

type KnownAction = RequestSecurityAction | ReceiveSecurityAction;

export const actionCreators = {
    requestSecurities: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const appState = getState();

        const shares = fetch(`/api/share`)
            .then(response => response.json() as Promise<Security[]>);

        const bonds = fetch(`/api/bond`)
            .then(response => response.json() as Promise<Security[]>);

        const etf = fetch(`/api/etf`)
            .then(response => response.json() as Promise<Security[]>);

        Promise.all([shares, bonds, etf]).then(([shares, bonds, etf]) => {
            dispatch({ type: 'SECURITY_RECEIVE', securities: [...shares, ...bonds, ...etf] });
        })


        dispatch({ type: 'SECURITY_REQUEST' });
    }
};

const unloadedState: SecuritiesState = {
    securities: [], isLoading: false
};

export const reducer: Reducer<SecuritiesState> = (state: SecuritiesState | undefined, incomingAction: Action): SecuritiesState => {
    if (state === undefined) {
        return unloadedState;
    }

    const action = incomingAction as KnownAction

    switch (action.type) {
        case 'SECURITY_REQUEST':
            return { ...state, isLoading: true }
        case 'SECURITY_RECEIVE':
            return {
                securities: action.securities,
                isLoading: false
            }
        default: return state
    }

}