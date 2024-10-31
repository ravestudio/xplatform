import { Settings } from "./model";

// A mock function to mimic making an async request for data
export function fetchSettings() {
  return new Promise<{ data: Settings }>((resolve) =>
    setTimeout(
      () =>
        resolve({
          data: { loadEmitentProfile: true, loadEmitentFinancial: true },
        }),
      500
    )
  );
}
