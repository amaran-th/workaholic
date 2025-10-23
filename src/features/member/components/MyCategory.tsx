import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { sessionAtom } from "@/features/auth/store/sessionAtom";
import {
  postCategoryApi,
  useGetCategoriesQuery,
} from "@/features/category/category-api";
import { Color } from "@/lib/data";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import CategoryItem from "./CategoryItem";
import ColorPicker from "./ColorPicker";

function MyCategory() {
  const queryClient = useQueryClient();
  const [session] = useAtom(sessionAtom);
  const [newCategoryName, setNewCategoryName] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<Color>("white");
  const [openedId, setOpenedId] = useState<string | null>(
    "95c5983a-5b9d-4e3c-8558-12ae1667c471"
  );
  const { data } = useGetCategoriesQuery({ memberId: session?.user.id });

  const memberId = useMemo(() => session?.user.id, [session]);
  const postCategory = useMutation({
    mutationFn: postCategoryApi,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["categories", { memberId }],
      }),
  });

  useEffect(() => {
    console.log(data?.map((a) => a.id));
  }, [data]);

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;
    postCategory.mutate({
      name: newCategoryName,
      color: selectedColor,
      memberId: memberId!,
    });
    setNewCategoryName("");
  };

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle>카테고리 & 스프린트 관리</CardTitle>
        <CardDescription>
          목적과 기간에 맞게 업무를 분류해보세요.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="flex gap-2">
          <ColorPicker
            selectedColor={selectedColor}
            onSelect={setSelectedColor}
          />
          <Input
            placeholder="새 카테고리 이름"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
          />
          <Button onClick={handleAddCategory}>
            <Plus className="w-4 h-4 mr-1" /> 추가
          </Button>
        </div>
        <div className="flex flex-col">
          {data?.map((category) => (
            <CategoryItem
              key={category.id}
              category={category}
              open={openedId === category.id}
              setOpen={setOpenedId}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default MyCategory;
