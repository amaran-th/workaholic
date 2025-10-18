import { sessionAtom } from "@/features/auth/store/sessionAtom";
import { useAtom } from "jotai";
import { useEffect } from "react";
import { useGetInfoQuery } from "../member-api";

function Profile() {
  const [session] = useAtom(sessionAtom);
  const { data } = useGetInfoQuery(
    { memberId: session!.user.id! },
    { enabled: !!session?.user.id }
  );
  useEffect(() => {
    console.log(data);
  }, [data]);
  return (
    <div>
      {data?.email}
      {data?.name}
    </div>
  );
}

export default Profile;
