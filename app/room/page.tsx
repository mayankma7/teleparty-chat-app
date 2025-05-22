"use client";

import { CreateChatRoom } from "@/components/chat/create-room";
import { useChatClient } from "@/hooks/chat-client";
import { useUser } from "@/hooks/user";
import { UserDetailsFormData, userDetailsSchema } from "@/schema/user-details";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

export default function ChatRoomPage() {
  const { createRoom } = useChatClient();
  const router = useRouter();
  const { nickname } = useUser();

  const userDetailsForm = useForm<UserDetailsFormData>({
    resolver: zodResolver(userDetailsSchema),
    defaultValues: {
      nickname,
    },
  });

  const onUserDetailsFormSubmit = async ({ nickname }: UserDetailsFormData) => {
    const roomId = await createRoom(nickname);
    router.push(`/room/${roomId}`);
  };

  return (
    <CreateChatRoom form={userDetailsForm} onSubmit={onUserDetailsFormSubmit} />
  );
}
