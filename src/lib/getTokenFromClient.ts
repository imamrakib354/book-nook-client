import { authClient } from "./auth-client";

export const getTokenFromClient = async () => {
  const { data, error } = await authClient.token();

  const token = data?.token;
  if (error || !token) throw new Error("Your session could not be verified. Please sign in again.");
  return token;
};
