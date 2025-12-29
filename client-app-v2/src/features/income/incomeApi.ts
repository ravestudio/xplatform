export const fetchSales = (year: number) => fetch(`/api/sales/${year}`);

export const fetchIncome = (year: number) => fetch(`/api/income/${year}`);
