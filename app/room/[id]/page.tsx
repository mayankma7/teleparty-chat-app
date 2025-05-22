"use client";

import { JoinChatRoom } from "@/components/chat/join-room";
import { ChatRoom } from "@/components/chat/room";
import { useChatClient } from "@/hooks/chat-client";
import { useUser } from "@/hooks/user";
import { UserDetailsFormData, userDetailsSchema } from "@/schema/user-details";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";

type PathParams = {
  id: string;
};

export default function ChatRoomPage() {
  const { id: roomId } = useParams<PathParams>();
  const { activeRoomId, joinRoom } = useChatClient();
  const { nickname } = useUser();

  const userDetailsForm = useForm<UserDetailsFormData>({
    resolver: zodResolver(userDetailsSchema),
    defaultValues: {
      nickname,
    },
  });

  const onUserDetailsFormSubmit = async ({ nickname }: UserDetailsFormData) => {
    await joinRoom(roomId, nickname);
  };

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
