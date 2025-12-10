import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";

import { TRow, useDataTable } from "../hooks/useDataTable";
import { AccessorKeyColumnDef } from "@tanstack/react-table";
import { TanstackTable } from "../../../shared/TanstackTable";
import { type UIEvent } from "react";

export const PositionsTree = () => {
  const { positions, details, treeRows, flatRows } = useDataTable();

  const [table, setTable] = useState<{ resetSelected: () => void } | null>(
    null
  );

  const columns: AccessorKeyColumnDef<TRow>[] = [
    {
      accessorKey: "accountName",
      header: "account",
      cell: (info) => (
        <>
          {info.row.getCanExpand() ? (
            <button
              style={{ marginLeft: info.row.depth * 12, marginRight: 5 }}
              onClick={info.row.getToggleExpandedHandler()}
            >
              {info.row.getIsExpanded() ? "-" : "+"}
            </button>
          ) : (
            <span style={{ marginLeft: info.row.depth * 32 }} />
          )}
          {info.getValue()}
        </>
      ),
      size: 180,
    },
    {
      accessorKey: "isin",
      header: "isin",
      cell: (info) => info.getValue(),
      size: 350,
    },
    {
      accessorKey: "limit",
      header: "limit",
      cell: (info) => info.getValue(),
      size: 80,
    },
    {
      accessorKey: "price",
      header: "price",
      cell: (info) => info.getValue(),
      size: 80,
    },
  ];

  useEffect(() => {
    console.log(flatRows);
  }, [flatRows]);

  useEffect(() => {
    console.log("updated");
  }, [table]);

  const getTreeSubRows = (row: TRow) => row.subRows;

  const getFlatSubRows = (row: TRow) => row.subRows;

  const runScroller = (e: UIEvent<HTMLDivElement>) => {
    console.log(e);
  };

  return (
    <TanstackTable
      columns={columns}
      tableData={treeRows}
      getSubRows={getTreeSubRows}
      onForwardTable={setTable}
      getRowId={(row) => row.id}
      //onScroll={runScroller}
    />
  );
};
