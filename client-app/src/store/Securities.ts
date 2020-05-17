import { Action, Reducer } from 'redux'
import { AppThunkAction } from './';
import C from "../constants"

export interface SecuritiesState {
    isLoading: boolean
    securities: Security[]
}

export interface Security {
    id: number
    name: string,
    nominalPrice?: number
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

        fetch(`${C.apiUrl}/security`)
            .then(response => response.json() as Promise<Security[]>)
            .then(data => {
                dispatch({ type: 'SECURITY_RECEIVE', securities: data });
            });

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