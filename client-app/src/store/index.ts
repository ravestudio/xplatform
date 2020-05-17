import * as Deals from './Deals';
import * as Accounts from './Accounts';
import * as Securities from './Securities';
import * as Portfolio from './Portfolio';
import * as Financials from './Financials';
import * as Shares from './Shares';

export interface ApplicationState {
    securities: Securities.SecuritiesState | undefined
    deals: Deals.DealsState | undefined
    accounts: Accounts.AccountsState | undefined
    portfolio: Portfolio.PortfolioState | undefined
    financials: Financials.FinancialsState | undefined
    shares: Shares.SharesState | undefined
}

export const reducers = {
    securities: Securities.reducer,
    deals: Deals.reducer,
    accounts: Accounts.reducer,
    portfolio: Portfolio.reducer,
    financials: Financials.reducer,
    shares: Shares.reducer
};

export interface AppThunkAction<TAction> {
    (dispatch: (action: TAction) => void, getState: () => ApplicationState): void;
}