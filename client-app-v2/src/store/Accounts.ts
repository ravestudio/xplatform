import { Action, Reducer } from "redux";

export interface AccountsState {
  isLoading: boolean;
  accounts: Account[];
}

export interface Account {
  id: number;
  name: string;
}

const unloadedState: AccountsState = {
  accounts: [
    {
      id: 1,
      name: "BCS ИИС",
    },
    {
      id: 2,
      name: "VTB",
    },
    {
      id: 3,
      name: "BCS",
    },
    {
      id: 4,
      name: "Tinkoff",
    },
    {
      id: 5,
      name: "BCS small",
    },
    {
      id: 8,
      name: "InvestPalata",
    },
    {
      id: 12,
      name: "INVEST_BOX",
    },
  ],
  isLoading: false,
};

export const reducer: Reducer<AccountsState> = (
  state: AccountsState | undefined,
  incomingAction: Action
): AccountsState => unloadedState;
