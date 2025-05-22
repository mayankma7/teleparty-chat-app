"use client";

import { HTMLAttributes } from "react";
import { UserDetailsForm, UserDetailsFormProps } from "./user-details-form";
import { cn } from "@/lib/utils";

export type JoinChatRoomProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "onSubmit"
> &
  UserDetailsFormProps & {
    roomId: string;
  };

export const JoinChatRoom = ({
  roomId,
  form,
  onSubmit,
  className,
  ...props
}: JoinChatRoomProps) => {
  return (
    <div {...props} className={cn("", className)}>
      <div>Join room {roomId}</div>
      <UserDetailsForm form={form} onSubmit={onSubmit} />
    </div>
  );
};
