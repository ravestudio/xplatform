export const parseJwt = (token: string) => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    return null;
  }
};

export const setAuthToken = (token: string) => {
  localStorage.setItem("token", token);
};

export const getAuthToken = () => {
  const accessToken = localStorage.getItem("token") ?? undefined;

  if (!accessToken) return undefined;

  const decodedJwt = parseJwt(accessToken);

  if (decodedJwt.exp * 1000 < Date.now()) {
    return undefined;
  }

  return accessToken;
};
