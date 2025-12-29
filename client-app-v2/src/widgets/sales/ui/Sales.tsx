import { AccessorKeyColumnDef } from "@tanstack/react-table";
import { TanstackTable } from "../../../shared/TanstackTable";
import { SalesItem } from "../../../entities/sales";
import { useAppSelector } from "../../../app/hooks";
import { selectSales } from "../../../features/income/incomeSlice";

export const Sales = () => {
  const sales = useAppSelector(selectSales);

  const columns: AccessorKeyColumnDef<SalesItem>[] = [
    {
      accessorKey: "code",
      header: "Code",
      cell: (info) => info.getValue(),
      size: 80,
    },
    {
      accessorKey: "isin",
      header: "ISIN",
      cell: (info) => info.getValue(),
      size: 150,
    },
    {
      accessorKey: "number",
      header: "Number",
      cell: (info) => info.getValue(),
      size: 150,
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: (info) => info.getValue(),
      size: 250,
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: (info) => info.getValue(),
      size: 150,
    },
    {
      accessorKey: "count",
      header: "Count",
      cell: (info) => info.getValue(),
      size: 150,
    },
    {
      accessorKey: "cost",
      header: "Cost",
      cell: (info) => info.getValue(),
      size: 150,
    },
    {
      accessorKey: "volume",
      header: "Volume",
      cell: (info) => info.getValue(),
      size: 150,
    },
    {
      accessorKey: "profit",
      header: "Profit",
      cell: (info) => info.getValue(),
      footer: ({ table }) => {
        const total = table
          .getFilteredRowModel()
          .rows.reduce((sum, row) => sum + row.getValue<number>("profit"), 0);
        return `Operating Income: ${total.toFixed(2)}`;
      },
      size: 150,
    },
    {
      accessorKey: "tax",
      header: "tax",
      cell: (info) => info.getValue(),
      size: 150,
    },
  ];

  return <TanstackTable columns={columns} tableData={sales} />;
};
