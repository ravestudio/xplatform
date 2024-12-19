import { Settings } from "./model";

// A mock function to mimic making an async request for data
export function fetchSettings() {
  return new Promise<{ data: Settings }>((resolve) =>
    setTimeout(
      () =>
        resolve({
          data: { loadEmitentProfile: true, loadEmitentFinancial: false },
        }),
      500
    )
  );
}

export function saveSettings() {
  return new Promise<{ success: boolean }>((resolve) =>
    setTimeout(
      () =>
        resolve({
          success: true,
        }),
      1000
    )
  );
}
