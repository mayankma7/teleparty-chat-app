"use client";

import { SessionChatMessageWithId } from "@/hooks/chat-client";
import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";
import { formatTimestamp } from "@/lib/messages";

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
      <div
        {...props}
        className="bg-blue-200 dark:bg-sky-800 px-4 py-2 rounded-md text-center"
      >
        <span className="font-bold">{userNickname}</span> {body}
      </div>
    );
  }

  return (
    <div
      {...props}
      className={cn(
        "p-4 flex flex-col gap-1 bg-neutral-800 rounded-lg",
        className
      )}
    >
      <div className="flex gap-1 text-sm font-bold">
        {/* Removed since base64 image uploading for icons is broken */}
        {/* {userIcon && (
          <Image
            alt={`${userNickname}'s picture`}
            src={userIcon}
            width={20}
            height={20}
            className="overflow-hidden rounded-full object-contain bg-neutral-900"
          />
        )} */}
        <span>{userNickname}</span>
      </div>
      <div>{body}</div>
      <div className="text-xs text-neutral-400">
        {formatTimestamp(timestamp)}
      </div>
    </div>
  );
};
