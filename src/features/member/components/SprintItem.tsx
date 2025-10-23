import { Button } from "@/components/ui/button";
import { CalendarSelect } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { sessionAtom } from "@/features/auth/store/sessionAtom";
import { deleteSprintApi, patchSprintApi } from "@/features/sprint/sprint-api";
import { Sprint } from "@/features/sprint/types/sprint";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { Pencil, Reply, Save, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

interface SprintItemProps {
  sprint: Sprint;
}
function SprintItem({ sprint }: SprintItemProps) {
  const queryClient = useQueryClient();
  const [session] = useAtom(sessionAtom);
  const [editable, setEditable] = useState<boolean>(false);
  const [form, setForm] = useState<{
    name: string;
    startDate: string | null;
    endDate: string | null;
  }>({
    name: sprint.name,
    startDate: sprint.startDate,
    endDate: sprint.endDate,
  });

  const memberId = useMemo(() => session?.user.id, [session]);

  const patchSprint = useMutation({
    mutationFn: patchSprintApi,
    onSuccess: () => {
      setEditable(false);
      queryClient.invalidateQueries({
        queryKey: ["sprints", { memberId, categoryId: sprint.categoryId }],
      });
    },
  });

  const deleteSprint = useMutation({
    mutationFn: deleteSprintApi,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["sprints", { memberId, categoryId: sprint.categoryId }],
      }),
  });

  useEffect(() => {
    setForm({
      name: sprint.name,
      startDate: sprint.startDate,
      endDate: sprint.endDate,
    });
  }, [sprint, setForm, editable]);

  const handleFormChange = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };
  return (
    <div key={sprint.id} className="text-sm border rounded-md p-2 flex gap-2">
      <div className="grow flex flex-col gap-2">
        {editable ? (
          <Input
            className="text-sm h-8 px-2"
            value={form.name}
            onChange={(e) => handleFormChange("name", e.target.value)}
          />
        ) : (
          <p className="leading-8 font-bold">{form.name}</p>
        )}
        <div className="flex gap-2">
          <CalendarSelect
            label="시작일"
            date={form.startDate}
            onSelect={(newValue) => {
              handleFormChange("startDate", newValue?.toISOString() ?? null);
            }}
            readonly={!editable}
          />
          <CalendarSelect
            label="종료일"
            date={form.endDate}
            onSelect={(newValue) => {
              handleFormChange("endDate", newValue?.toISOString() ?? null);
            }}
            readonly={!editable}
          />
        </div>
      </div>
      {editable ? (
        <div className="flex gap-1">
          <Button
            size="icon-sm"
            variant="outline"
            onClick={() => {
              setEditable(false);
            }}
          >
            <Reply size={16} />
          </Button>
          <Button
            size="icon-sm"
            onClick={() => {
              patchSprint.mutate({ id: sprint.id, data: form });
            }}
          >
            <Save size={16} />
          </Button>
        </div>
      ) : (
        <div className="flex gap-1">
          <Button
            size="icon-sm"
            onClick={() => {
              setEditable(true);
            }}
          >
            <Pencil size={16} />
          </Button>
          <Button
            size="icon-sm"
            variant="outline"
            color="error"
            onClick={() => {
              if (confirm("정말로 삭제하시겠습니까?")) {
                deleteSprint.mutate({ id: sprint.id });
              }
            }}
          >
            <Trash2 size={16} />
          </Button>
        </div>
      )}
    </div>
  );
}

export default SprintItem;
