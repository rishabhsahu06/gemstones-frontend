import { useSession } from "next-auth/react";

export default function useAccessToken() {
  const { data: session, status } = useSession();

  const accessToken = session?.accessToken || null;

  return { accessToken, user: session?.user, status };
}
