"use client";

import { HTMLAttributes } from "react";
import { UserDetailsForm, UserDetailsFormProps } from "./user-details-form";
import { cn } from "@/lib/utils";

export type CreateChatRoomProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "onSubmit"
> &
  UserDetailsFormProps;

export const CreateChatRoom = ({
  form,
  onSubmit,
  className,
  ...props
}: CreateChatRoomProps) => {
  return (
    <div
      className={cn(
        "w-full h-full dark:bg-neutral-900 flex flex-col items-center justify-center",
        className
      )}
    >
      <div className="dark:bg-neutral-800 px-12 py-18 rounded-lg flex flex-col gap-6">
        <div className="text-2xl font-light">New room</div>
        <UserDetailsForm form={form} onSubmit={onSubmit} />
      </div>
    </div>
  );
};
