import counterReducer from "../features/counter/counterSlice";
import settingsReducer from "../features/settings/settingsSlice";
import financialEditReducer from "../features/financial-edit/store/financialEditSlice";

import * as Deals from "./Deals";
import * as Accounts from "./Accounts";
import * as Emitents from "./Emitents";
import * as Securities from "./Securities";
import * as Portfolio from "./Portfolio";
import * as Financials from "./Financials";
import * as Shares from "./Shares";
import * as Import from "./Import";
import * as Auth from "../features/auth/store";
import * as Positions from "./Positions";
import * as Products from "./Products";
import * as System from "./System";
import * as NoteList from "../widgets/note-list/store";
import * as FinancialList from "../widgets/financial-list/store";

export interface ApplicationState {
  emitents: Emitents.EmitentsState | undefined;
  securities: Securities.SecuritiesState | undefined;
  system: System.SystemState | undefined;
  deals: Deals.DealsState | undefined;
  accounts: Accounts.AccountsState | undefined;
  portfolio: Portfolio.PortfolioState | undefined;
  positions: Positions.PositionsState | undefined;
  products: Products.ProductsState | undefined;
  financials: Financials.FinancialsState | undefined;
  shares: Shares.SharesState | undefined;
  import: Import.ImportState | undefined;
  auth: Auth.AuthState | undefined;
  noteList: NoteList.NoteListState | undefined;
  financialList: FinancialList.FinancialListState | undefined;
}

export const reducers = {
  counter: counterReducer,
  settings: settingsReducer,
  financialEdit: financialEditReducer,
  emitents: Emitents.reducer,
  securities: Securities.reducer,
  system: System.reducer,
  deals: Deals.reducer,
  accounts: Accounts.reducer,
  portfolio: Portfolio.reducer,
  positions: Positions.reducer,
  products: Products.reducer,
  financials: Financials.reducer,
  shares: Shares.reducer,
  import: Import.reducer,
  auth: Auth.reducer,
  noteList: NoteList.reducer,
  financialList: FinancialList.reducer,
};

export interface AppThunkAction<TAction> {
  (dispatch: (action: TAction) => void, getState: () => ApplicationState): void;
}
