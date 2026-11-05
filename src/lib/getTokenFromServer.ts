import { headers } from "next/headers";
import { auth } from "./auth";

export const getTokenFromServer = async () => {
  const jwtToken = await auth.api.getToken({
    headers: await headers(),
  });
  const token = jwtToken?.token;
  if (!token) throw new Error("Your session could not be verified. Please sign in again.");

  return token;
};
