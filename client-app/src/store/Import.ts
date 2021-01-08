import { Refresh } from '@material-ui/icons';
import { Action, Reducer } from 'redux'
import { isTemplateExpression } from 'typescript';
import { AppThunkAction } from './';

export interface ImportState {
    isLoading: boolean,
    importType?: string,

    securities: Security[]
}

export interface Security {
    id: string,
    isin: string,
    ticker: string,
    currency: string,
    name: string,
    board: string,
    emitent: string,
    processed: boolean

}

interface RequestDataAction {
    type: 'IMPORT/DATA_REQUEST',
    importType: string,
}

interface ReceiveDataAction {
    type: 'IMPORT/DATA_RECEIVE',
    importType: string,
    payload: any
}

type KnownAction = RequestDataAction | ReceiveDataAction;

export const actionCreators = {
    RequestDataAction: (importType: string): AppThunkAction<KnownAction> => (dispatch, getState) => {

        const appState = getState();


        fetch(`/api/SecurityRaw`)
            .then(response => response.json())
            .then(payload => {
                dispatch({ type: 'IMPORT/DATA_RECEIVE', importType, payload });
            });

        dispatch({ type: 'IMPORT/DATA_REQUEST', importType });
    },

    ImportDataAction: (isin: string[]): AppThunkAction<KnownAction> => (dispatch, getState) => {

        fetch(`/api/Import`, {
            method: 'POST',
            body: JSON.stringify({
                object: "stock",
                isin
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                console.log(response.status)
            })

    },

    RefreshList: (): AppThunkAction<KnownAction> => (dispatch, getState) => {

        fetch(`/api/SecurityRaw`, {
            method: 'POST',
        })
            .then(response => {
                console.log(response.status)
            })

    }
};

const unloadedState: ImportState = {
    importType: "stock",
    securities: [],
    isLoading: false
};

export const reducer: Reducer<ImportState> = (state: ImportState | undefined, incomingAction: Action): ImportState => {
    if (state === undefined) {
        return unloadedState;
    }

    const action = incomingAction as KnownAction

    switch (action.type) {
        case 'IMPORT/DATA_REQUEST':
            return {
                ...state,
                importType: action.importType,
                isLoading: true
            }
        case 'IMPORT/DATA_RECEIVE':
            return {
                importType: action.importType,
                securities: action.payload.map((item:any) => ({...item, id : item.isin})),
                isLoading: false
            }
        default: return state
    }
}