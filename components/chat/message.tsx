"use client";

import { SessionChatMessageWithId } from "@/hooks/chat-client";
import { cn } from "@/lib/utils";
import { ChatMessage as ChatMessageType } from "@/types/messages";
import { HTMLAttributes } from "react";

type ChatMessageProps = SessionChatMessageWithId &
  HTMLAttributes<HTMLDivElement>;

export const ChatMessage = ({
  userNickname,
  userIcon,
  body,
  timestamp,
  className,
  isSystemMessage,
  ...props
}: ChatMessageProps) => {
  if (isSystemMessage) {
    return (
      <div className="bg-blue-200 px-4 py-2 rounded-md text-center">
        <span className="font-bold">{userNickname}</span> {body}
      </div>
    );
  }

  return (
    <div className={cn("p-4 flex flex-col gap-2", className)}>
      <div>{userNickname}</div>
      <div>{body}</div>
      <div>{timestamp}</div>
    </div>
  );
};
