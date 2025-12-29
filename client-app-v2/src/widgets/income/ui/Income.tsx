import { AccessorKeyColumnDef } from "@tanstack/react-table";
import { TanstackTable } from "../../../shared/TanstackTable";

import { useAppSelector } from "../../../app/hooks";
import { IncomeItem } from "../../../entities/income";
import { selectIncome } from "../../../features/income/incomeSlice";

export const Income = () => {
  const income = useAppSelector(selectIncome);

  const columns: AccessorKeyColumnDef<IncomeItem>[] = [
    {
      accessorKey: "incomeType",
      header: "IncomeType",
      cell: (info) => info.getValue(),
      size: 180,
    },
    {
      accessorKey: "sourse",
      header: "Sourse",
      cell: (info) => info.getValue(),
      size: 150,
    },
    {
      accessorKey: "paymentDate",
      header: "PaymentDate",
      cell: (info) => info.getValue(),
      size: 250,
    },
    {
      accessorKey: "volume",
      header: "Volume",
      cell: (info) => info.getValue(),
      footer: ({ table }) => {
        const total = table
          .getFilteredRowModel()
          .rows.reduce((sum, row) => sum + row.getValue<number>("volume"), 0);
        return `Total Income: ${total.toFixed(2)}`;
      },
      size: 150,
    },
  ];

  return <TanstackTable columns={columns} tableData={income} />;
};
