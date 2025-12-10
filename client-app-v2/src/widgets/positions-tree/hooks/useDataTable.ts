import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";

//import * as PositionsStore from "../../../store/Positions";
import { Position, PositionDetails } from "../../../store/Positions";
import { v4 } from "uuid";

type TPosition = Position & { accountId: number };

export type TRow = {
  id: string;
  accountName?: string;
  accountId?: number;
  isin?: string;
  limit?: number;
  price?: number;

  parentId?: string;
  subRows: TRow[];
};

export const useDataTable = () => {
  //const { requestPositions } = PositionsStore.actionCreators;

  const accounts = useAppSelector((state) => state.accounts.accounts);

  //const dispatch = useAppDispatch();

  const [positions, setPositions] = useState<TPosition[]>([]);
  const [details, setDetails] = useState<PositionDetails[]>([]);
  const [treeRows, setTreeRows] = useState<TRow[]>([]);
  const [flatRows, setFlatRows] = useState<TRow[]>([]);

  const loadData = async () => {
    const positions = accounts.map((account) =>
      fetch(`/api/position/get?accountId=${account.id}`)
        .then((response) => response.json() as Promise<Position[]>)
        .then((data) => data.map((pos) => ({ ...pos, accountId: account.id })))
    );

    const posResponse = await Promise.all(positions);

    const positionsData = posResponse.reduce(
      (acc, current) => [...acc, ...current],
      []
    );

    const details = positionsData.map((pos) =>
      fetch(
        `/api/position/getDetails?security=${pos.isin}&accountId=${pos.accountId}`
      ).then((response) => response.json() as Promise<PositionDetails[]>)
    );

    const detailsResponse = await Promise.all(details);
    const detailsData = detailsResponse.reduce(
      (acc, current) => [...acc, ...current],
      []
    );

    const treeRows: TRow[] = accounts.map((acc) => ({
      id: acc.id.toString(),
      account: acc.id,
      accountName: acc.name,
      subRows: positionsData
        .filter((pos) => pos.accountId === acc.id)
        .map((pos) => ({
          id: v4(),
          account: pos.accountId,
          isin: pos.isin,
          limit: pos.limit,
          subRows: detailsData
            .filter(
              (detail) =>
                detail.account === pos.accountId && detail.isin === pos.isin
            )
            .map((detail) => ({
              id: v4(),
              account: detail.account,
              isin: detail.isin,
              limit: detail.limit,
              price: detail.price,
              subRows: [],
            })),
        })),
    }));

    const flatRows: TRow[] = treeRows.reduce<TRow[]>(
      (acc, account) => [
        ...acc,
        ...[
          {
            id: account.id,
            accountName: account.accountName,
            subRows: [],
          },

          ...account.subRows.reduce<TRow[]>(
            (pcc, cpos) => [
              ...pcc,
              ...[
                {
                  id: cpos.id,
                  parentId: account.id,
                  isin: cpos.isin,
                  limit: cpos.limit,
                  subRows: [],
                },

                ...cpos.subRows.reduce<TRow[]>(
                  (dcc, cdt) => [
                    ...dcc,
                    {
                      id: v4(),
                      parentId: cpos.id,
                      isin: cdt.isin,
                      limit: cdt.limit,
                      price: cdt.price,
                      subRows: [],
                    },
                  ],
                  []
                ),
              ],
            ],
            []
          ),
        ],
      ],
      []
    );

    setPositions(positionsData);
    setDetails(detailsData);
    setTreeRows(treeRows);
    setFlatRows(flatRows);
  };

  useEffect(() => {
    loadData();
  }, [accounts]);

  return { positions, details, treeRows, flatRows };
};
