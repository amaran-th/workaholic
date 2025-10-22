import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { sessionAtom } from "@/features/auth/store/sessionAtom";
import { notifyNotSupportedFeature } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { Loader2, Plus } from "lucide-react";
import Image from "next/image";
import { ReactNode, useCallback, useEffect, useState } from "react";
import { patchMemberInfoApi, useGetInfoQuery } from "../member-api";

type InfoRowProps = {
  label: string;
  children: ReactNode;
};

function InfoRow({ label, children }: InfoRowProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
      <Label className="w-28 text-right sm:text-left font-medium">
        {label}
      </Label>
      <div className="flex-1">{children}</div>
    </div>
  );
}

function MyProfile() {
  const [session] = useAtom(sessionAtom);
  const queryClient = useQueryClient();
  const [form, setForm] = useState<{ name: string; bio: string }>({
    name: "",
    bio: "",
  });
  const [isEdited, setIsEdited] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const { data, isFetching } = useGetInfoQuery({ memberId: session?.user.id });

  const patchMemberInfo = useMutation({
    mutationFn: patchMemberInfoApi,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["member-info", { memberId: session?.user.id }],
      });
    },
    onSettled: () => {
      setIsSaving(false);
    },
  });

  useEffect(() => {
    if (!data) return;
    setForm({ name: data.name ?? "", bio: data.bio ?? "" });
    console.log(data);
  }, [data]);

  const handleChange = useCallback(
    (key: "name" | "bio", value: string) => {
      if (!isEdited) setIsEdited(true);
      setForm((prev) => ({ ...prev, [key]: value }));
    },
    [isEdited]
  );

  const handleSave = useCallback(async () => {
    if (!session?.user?.id) return;
    setIsSaving(true);
    patchMemberInfo.mutate({
      id: session?.user.id,
      data: {
        ...form,
      },
    });
  }, [session, patchMemberInfo, form]);

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle>프로필</CardTitle>
        <CardDescription>개인 정보를 관리할 수 있습니다.</CardDescription>
      </CardHeader>
      <CardContent className="flex gap-8">
        {isFetching ? (
          <>
            <Skeleton className="w-[200px] h-[200px] rounded-full" />
            <div className="flex flex-col gap-3 flex-1 justify-center">
              <Skeleton className="h-10 w-1/2" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-24 w-full" />
            </div>
          </>
        ) : (
          <>
            <div className="relative">
              <Image
                src={data?.avatarUrl ?? "/default-profile.png"}
                alt={"프로필 이미지"}
                width="200"
                height="200"
                className="rounded-full"
              />
              <Button
                className="absolute bottom-0 right-0"
                onClick={notifyNotSupportedFeature}
              >
                <Plus />
              </Button>
            </div>
            <div className="flex flex-col gap-3 justify-center flex-1 w-full">
              <InfoRow label="이름">
                <Input
                  value={form.name}
                  placeholder="이름을 입력하세요"
                  onChange={(e) => handleChange("name", e.target.value)}
                />
              </InfoRow>
              <InfoRow label="메일 주소">
                <p className="text-sm w-full text-muted-foreground">
                  {data?.email ?? ""}
                </p>
              </InfoRow>
              <InfoRow label="한 줄 소개">
                <Textarea
                  value={form.bio}
                  placeholder="자기소개를 입력하세요"
                  onChange={(e) => handleChange("bio", e.target.value)}
                />
              </InfoRow>
            </div>
          </>
        )}
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button
          onClick={handleSave}
          disabled={isSaving || !isEdited}
          className="self-end mt-2"
        >
          {isSaving ? <Loader2 className="animate-spin size-4 mr-2" /> : null}
          저장
        </Button>
      </CardFooter>
    </Card>
  );
}

export default MyProfile;
