"use client";

import { useChatClient } from "@/hooks/chat-client";
import { ChatMessage } from "./message";
import { useForm } from "react-hook-form";
import { UserMessageFormData, userMessageSchema } from "@/schema/user-message";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField } from "../ui/form";
import { useEffect, useRef, useState } from "react";
import { MemberList } from "./member-list";
import { TypingIndicator } from "./typing-indicator";
import { Input } from "../ui/input";
import { PaperPlaneIcon } from "@radix-ui/react-icons";

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
  const messageContainerRef = useRef<HTMLDivElement>(null);

  const onMessageSubmit = async ({ message }: UserMessageFormData) => {
    sendMessage(message);
    dispatchTypingStatus(false);
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
  }, [isTyping, dispatchTypingStatus]);

  useEffect(() => {
    if (!messageContainerRef.current) {
      return;
    }

    const children = [...messageContainerRef.current.children];

    children[children.length - 1].scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col w-full h-full overflow-auto">
      <div className="flex px-6 py-4 justify-between">
        <div>
          In room <span className="font-medium">{activeRoomId}</span>
        </div>
        <MemberList />
      </div>
      <div
        className="flex-1 overflow-auto flex flex-col gap-4 p-4"
        ref={messageContainerRef}
      >
        {messages?.map((e) => (
          <ChatMessage key={e.messageId} {...e} />
        ))}
      </div>
      <TypingIndicator />
      <Form {...userMessageForm}>
        <form
          onSubmit={userMessageForm.handleSubmit(onMessageSubmit)}
          className="flex gap-2 p-4 items-center"
        >
          <FormField
            control={userMessageForm.control}
            name="message"
            render={({ field }) => (
              <Input placeholder="Type a message" {...field} />
            )}
          />
          <button
            aria-label="Submit"
            className="border border-foreground w-8 h-8 rounded-md grid place-content-center"
          >
            <PaperPlaneIcon />
          </button>
        </form>
      </Form>
    </div>
  );
};
