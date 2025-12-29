export const fetchSales = (year: number) => fetch(`/api/sales/${year}`);

export const fetchIncome = (year: number, settings: { token: string }) =>
  fetch(`/api/income/${year}`, {
    headers: {
      Authorization: settings.token,
    },
  });
