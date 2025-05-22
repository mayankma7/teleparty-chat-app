"use client";

import { useChatClient } from "@/hooks/chat-client";
import { ChatMessage } from "./message";
import { useForm } from "react-hook-form";
import { UserMessageFormData, userMessageSchema } from "@/schema/user-message";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField } from "../ui/form";
import { useEffect, useState } from "react";
import { MemberList } from "./member-list";
import { TypingIndicator } from "./typing-indicator";
import { Input } from "../ui/input";

export const ChatRoom = () => {
  const {
    activeRoomId,
    messages,
    sendMessage,
    setTypingStatus: dispatchTypingStatus,
  } = useChatClient();

  const userMessageForm = useForm<UserMessageFormData>({
    resolver: zodResolver(userMessageSchema),
    defaultValues: {
      message: "",
    },
  });

  const inputMessage = userMessageForm.watch("message");

  const [isTyping, setIsTyping] = useState(false);

  const onMessageSubmit = async ({ message }: UserMessageFormData) => {
    sendMessage(message);
    userMessageForm.reset();
  };

  useEffect(() => {
    setIsTyping(true);

    const timeout = setTimeout(() => {
      setIsTyping(false);
    }, 2000);

    return () => clearTimeout(timeout);
  }, [inputMessage]);

  useEffect(() => {
    if (!isTyping) {
      return;
    }

    dispatchTypingStatus(true);

    return () => dispatchTypingStatus(false);
  }, [isTyping]);

  return (
    <div className="flex flex-col w-full h-full overflow-auto">
      <div className="flex gap-12">
        <div>In room: {activeRoomId}</div>
        <MemberList />
      </div>
      <div className="flex-1 overflow-auto flex flex-col gap-2 p-4">
        {messages?.map((e) => (
          <ChatMessage key={e.messageId} {...e} />
        ))}
      </div>
      <TypingIndicator />
      <Form {...userMessageForm}>
        <form onSubmit={userMessageForm.handleSubmit(onMessageSubmit)}>
          <FormField
            control={userMessageForm.control}
            name="message"
            render={({ field }) => (
              <Input placeholder="Type a message" {...field} />
            )}
          />
          <button>Submit</button>
        </form>
      </Form>
    </div>
  );
};
