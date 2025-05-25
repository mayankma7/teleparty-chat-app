"use client";

import { CreateChatRoom } from "@/components/chat/create-room";
import { JoinChatRoom } from "@/components/chat/join-room";
import { ChatRoom } from "@/components/chat/room";
import { useChatClient } from "@/hooks/chat-client";
import { useUser } from "@/hooks/user";
import { UserDetailsFormData, userDetailsSchema } from "@/schema/user-details";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useForm } from "react-hook-form";

function ChatRoomPage() {
  const { activeRoomId, createRoom, joinRoom } = useChatClient();
  const router = useRouter();
  const { nickname } = useUser();

  const searchParams = useSearchParams();
  const roomId = searchParams.get("id");

  const userDetailsForm = useForm<UserDetailsFormData>({
    resolver: zodResolver(userDetailsSchema),
    defaultValues: {
      nickname,
    },
  });

  const onUserDetailsFormSubmit = async ({
    nickname,
    pictureUrl,
  }: UserDetailsFormData) => {
    if (!roomId) {
      const newRoomId = await createRoom(nickname, pictureUrl);
      router.replace(`/room?id=${newRoomId}`);
    } else {
      await joinRoom(roomId, nickname, pictureUrl);
    }
  };

  if (!roomId)
    return (
      <CreateChatRoom
        form={userDetailsForm}
        onSubmit={onUserDetailsFormSubmit}
      />
    );

  if (!activeRoomId) {
    return (
      <JoinChatRoom
        roomId={roomId}
        form={userDetailsForm}
        onSubmit={onUserDetailsFormSubmit}
      />
    );
  }

  return <ChatRoom />;
}

export default function ChatRoomPageWithSuspense() {
  return (
    <Suspense fallback="Loading">
      <ChatRoomPage />
    </Suspense>
  );
}
