export interface Settings {
  loadEmitentProfile: boolean;
  loadEmitentFinancial: boolean;
}

export type stringbool = "yes" | "no";

export interface FormData {
  loadEmitentProfile: stringbool;
  loadEmitentFinancial: stringbool;
}

export const toFormData = (data: Settings): FormData => ({
  ...data,
  loadEmitentProfile: data.loadEmitentProfile ? "yes" : "no",
  loadEmitentFinancial: data.loadEmitentFinancial ? "yes" : "no",
});
