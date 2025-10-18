import { sessionAtom } from "@/features/auth/store/sessionAtom";
import { useGetCategoriesQuery } from "@/features/category/category-api";
import { colorMap } from "@/lib/data";
import { useAtom } from "jotai";
import { useEffect } from "react";

function MyCategory() {
  const [session] = useAtom(sessionAtom);
  const { data } = useGetCategoriesQuery(
    { memberId: session!.user.id! },
    { enabled: !!session?.user.id }
  );
  useEffect(() => {
    console.log(data);
  }, [data]);
  return (
    <div>
      {data?.map((category) => (
        <span
          key={category.id}
          className="px-4 rounded-full py-1"
          style={{
            backgroundColor: colorMap[category.color].sub,
            color: colorMap[category.color].primary,
          }}
        >
          {category.name}
        </span>
      ))}
    </div>
  );
}

export default MyCategory;
