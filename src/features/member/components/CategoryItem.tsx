import { Button } from "@/components/ui/button";
import { CalendarSelect } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { sessionAtom } from "@/features/auth/store/sessionAtom";
import {
  deleteCategoryApi,
  patchCategoryApi,
} from "@/features/category/category-api";
import { Category } from "@/features/category/types/category";
import { postSprintApi, useGetSprintQuery } from "@/features/sprint/sprint-api";
import { Color } from "@/lib/data";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { Pencil, Plus, Reply, Save, Trash2 } from "lucide-react";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import ColorPicker from "./ColorPicker";
import SprintItem from "./SprintItem";

interface CategoryItemProps {
  category: Category;
  open: boolean;
  setOpen: Dispatch<SetStateAction<string | null>>;
}
function CategoryItem({ category, open, setOpen }: CategoryItemProps) {
  const queryClient = useQueryClient();
  const [session] = useAtom(sessionAtom);
  const [editable, setEditable] = useState<boolean>(false);
  const [form, setForm] = useState<{ name: string; color: Color }>({
    name: category.name,
    color: category.color,
  });
  const [newSprintForm, setNewSprintForm] = useState<{
    name: string;
    startDate: string | null;
    endDate: string | null;
  }>({
    name: "",
    startDate: null,
    endDate: null,
  });

  const { data: sprints, isFetching } = useGetSprintQuery({
    memberId: session?.user.id,
    categoryId: open ? category.id : null,
  });

  const memberId = useMemo(() => session?.user.id, [session]);

  const patchCategory = useMutation({
    mutationFn: patchCategoryApi,
    onSuccess: () => {
      setEditable(false);
      queryClient.invalidateQueries({
        queryKey: ["categories", { memberId }],
      });
    },
  });

  const deleteCategory = useMutation({
    mutationFn: deleteCategoryApi,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["categories", { memberId }],
      }),
  });

  const postSprint = useMutation({
    mutationFn: postSprintApi,
    onSuccess: () => {
      setNewSprintForm({
        name: "",
        startDate: null,
        endDate: null,
      });
      queryClient.invalidateQueries({
        queryKey: ["sprints", { memberId, categoryId: category.id }],
      });
    },
  });

  const handleToggle = (categoryId: string) => {
    setOpen((prev) => (prev === categoryId ? null : categoryId));
  };

  useEffect(() => {
    setForm({ name: category.name, color: category.color });
  }, [category, setForm, editable]);

  useEffect(() => {
    setNewSprintForm({
      name: "",
      startDate: null,
      endDate: null,
    });
  }, [open]);

  const handleFormChange = useCallback(
    (key: string, value: any) => {
      setForm((prev) => ({ ...prev, [key]: value }));
    },
    [setForm]
  );

  const handleSprintFormChange = useCallback(
    (key: string, value: any) => {
      setNewSprintForm((prev) => ({ ...prev, [key]: value }));
    },
    [setNewSprintForm]
  );

  const handleAddSprint = () => {
    postSprint.mutate({
      ...newSprintForm,
      categoryId: category.id,
      memberId: memberId!,
    });
  };

  return (
    <div className="border-t-1 last:border-b-1">
      <div
        className="flex p-3 gap-2 items-center hover:bg-muted/30"
        onClick={() => handleToggle(category.id)}
      >
        <ColorPicker
          selectedColor={form.color}
          onSelect={(color: Color) => {
            handleFormChange("color", color);
          }}
          readonly={!editable}
        />
        <div className="grow">
          {editable ? (
            <Input
              value={form.name}
              onClick={(e) => {
                e.stopPropagation();
              }}
              onChange={(e) => handleFormChange("name", e.target.value)}
              className="bg-white"
            />
          ) : (
            <p className="leading-9">{form.name}</p>
          )}
        </div>
        {editable ? (
          <div className="flex gap-1">
            <Button
              size="icon-sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                setEditable(false);
              }}
            >
              <Reply size={16} />
            </Button>
            <Button
              size="icon-sm"
              onClick={(e) => {
                e.stopPropagation();
                patchCategory.mutate({ id: category.id, data: form });
              }}
            >
              <Save size={16} />
            </Button>
          </div>
        ) : (
          <div className="flex gap-1">
            <Button
              size="icon-sm"
              onClick={(e) => {
                e.stopPropagation();
                setEditable(true);
              }}
            >
              <Pencil size={16} />
            </Button>
            <Button
              size="icon-sm"
              variant="outline"
              color="error"
              onClick={(e) => {
                e.stopPropagation();
                if (
                  confirm("삭제하시겠습니까? 관련 스프린트도 함께 삭제됩니다.")
                ) {
                  deleteCategory.mutate({ id: category.id });
                }
              }}
            >
              <Trash2 size={16} />
            </Button>
          </div>
        )}
      </div>
      {open && (
        <div className="p-3 pt-1 pl-7">
          <div className="pl-4 space-y-4 border-l-4">
            <div className="text-sm flex gap-2 items-end">
              <div className="grow flex gap-2">
                <div className="flex flex-col gap-1 grow">
                  <Label htmlFor="date" className="text-xs">
                    스프린트명
                  </Label>
                  <Input
                    placeholder="새 스프린트 이름"
                    value={newSprintForm.name}
                    onChange={(e) =>
                      handleSprintFormChange("name", e.target.value)
                    }
                    className="text-sm h-8 px-2"
                  />
                </div>
                <div className="flex gap-2">
                  <CalendarSelect
                    label="시작일"
                    date={newSprintForm.startDate}
                    onSelect={(newValue) => {
                      handleSprintFormChange(
                        "startDate",
                        newValue?.toISOString() ?? null
                      );
                    }}
                  />
                  <CalendarSelect
                    label="종료일"
                    date={newSprintForm.endDate}
                    onSelect={(newValue) => {
                      handleSprintFormChange(
                        "endDate",
                        newValue?.toISOString() ?? null
                      );
                    }}
                  />
                </div>
              </div>
              <Button onClick={handleAddSprint}>
                <Plus size={16} />
              </Button>
            </div>

            {isFetching ? (
              <p className="text-sm text-muted-foreground">불러오는 중...</p>
            ) : sprints?.length ? (
              <div className="flex flex-col gap-2">
                {sprints.map((sprint) => (
                  <SprintItem key={sprint.id} sprint={sprint} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                스프린트가 없습니다.
              </p>
            )}
          </div>
        </div>
      )}
      {/* <Button
        variant="outline"
        onClick={() => handleToggle(category.id)}
        className="w-full"
      >
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </Button> */}
    </div>
  );
}

export default CategoryItem;
