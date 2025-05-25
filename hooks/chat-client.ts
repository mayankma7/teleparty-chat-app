"use client";

import { ChatMessage } from "@/types/messages";
import { useCallback, useEffect, useMemo } from "react";
import {
  SessionChatMessage,
  SocketEventHandler,
  SocketMessageTypes,
  TelepartyClient,
} from "teleparty-websocket-lib";
import { create } from "zustand";
import { useUser } from "./user";
import { SocketMessage } from "teleparty-websocket-lib/lib/SocketMessage";
import { MemberListSocketMessageData, RoomMembers } from "@/types/members";
import { TypingPresenceSocketMessageData } from "@/types/presence";
import { generateDefaultAvatar } from "@/lib/avatar";

export type SessionChatMessageWithId = SessionChatMessage & {
  messageId: string;
};

type ConnectionProperties =
  | { status: "PENDING" }
  | { status: "SUCCESS" }
  | { status: "CLOSED" }
  | { status: "ERROR"; error: unknown };

const transformUserList = (list: MemberListSocketMessageData): RoomMembers => {
  return Object.fromEntries(
    list.map((item) => [
      item.socketConnectionId,
      {
        nickname: item.userSettings.userNickname,
        pictureUrl: item.userSettings.userIcon,
      },
    ])
  );
};

const initializeClient = (
  set: (
    partial:
      | ChatStore
      | Partial<ChatStore>
      | ((state: ChatStore) => ChatStore | Partial<ChatStore>)
  ) => void
) => {
  const onMessage = (message: SocketMessage) => {
    if (message.type === SocketMessageTypes.SEND_MESSAGE) {
      set((state) => ({
        ...state,
        messages: state.messages
          ? [...state.messages, message.data as SessionChatMessageWithId]
          : [message.data as SessionChatMessageWithId],
      }));
      return;
    }

    if (message.type === SocketMessageTypes.SET_TYPING_PRESENCE) {
      set((state) => ({
        ...state,
        typingUsers: (message.data as TypingPresenceSocketMessageData)
          .usersTyping,
      }));
      return;
    }

    if (message.type === "userList") {
      set((state) => ({
        ...state,
        members: transformUserList(message.data as MemberListSocketMessageData),
      }));
    }

    if (message.type === "userId") {
      useUser.getState().setId(message.data.userId);
    }
  };

  const handler: SocketEventHandler = {
    onConnectionReady: console.log,
    onClose: console.log,
    onMessage: onMessage,
  };
  return new TelepartyClient(handler);
};

type ChatStore = {
  client: TelepartyClient | null;
  connectionProperties: ConnectionProperties;
  activeRoomId: string | null;
  messages: SessionChatMessageWithId[] | null;
  members: RoomMembers | null;
  typingUsers: string[] | null;
  setConnectionProperties(connectionProperties: ConnectionProperties): void;
  setActiveRoomId(roomId: string | null): void;
  setMessages(messages: SessionChatMessageWithId[] | null): void;
  appendMessage(message: SessionChatMessageWithId): void;
};

export const useChatStore = create<ChatStore>((set) => ({
  client: initializeClient(set),
  connectionProperties: { status: "PENDING" },
  activeRoomId: null,
  messages: null,
  members: null,
  typingUsers: null,
  setConnectionProperties(connectionProperties) {
    set((state) => ({ ...state, connectionProperties }));
  },
  setActiveRoomId(roomId) {
    set((state) => ({ ...state, activeRoomId: roomId }));
  },
  setMessages(messages) {
    set((state) => ({ ...state, messages }));
  },
  appendMessage(message) {
    set((state) => ({
      ...state,
      messages: state.messages ? [...state.messages, message] : [message],
    }));
  },
}));

export type UseChatClientReturn = {
  createRoom(nickname: string, pictureUrl?: string): Promise<string>;
  joinRoom(
    roomId: string,
    nickname: string,
    pictureUrl?: string
  ): Promise<void>;
  activeRoomId: string | null;
  messages: ChatStore["messages"];
  members: ChatStore["members"];
  typingUsers: ChatStore["typingUsers"];
  sendMessage: (body: string) => void;
  setTypingStatus: (isTyping: boolean) => void;
};

export const useChatClient = (): UseChatClientReturn => {
  const {
    appendMessage,
    setConnectionProperties,
    messages,
    setMessages,
    activeRoomId,
    setActiveRoomId,
    client,
    members,
    typingUsers,
  } = useChatStore();
  const { setNickname, setPictureUrl, setId } = useUser();

  const createRoom = useCallback<UseChatClientReturn["createRoom"]>(
    async (nickname, pictureUrl) => {
      if (!client) {
        throw new Error();
      }
      const $pictureUrl = pictureUrl ?? generateDefaultAvatar(nickname);
      setNickname(nickname);
      setPictureUrl($pictureUrl);
      const roomId = await client.createChatRoom(nickname, $pictureUrl);
      setActiveRoomId(roomId);
      return roomId;
    },
    [client, setNickname, setPictureUrl, setActiveRoomId]
  );

  const joinRoom = useCallback<UseChatClientReturn["joinRoom"]>(
    async (roomId, nickname, pictureUrl) => {
      if (!client) {
        throw new Error();
      }
      const $pictureUrl = pictureUrl ?? generateDefaultAvatar(nickname);
      setNickname(nickname);
      setPictureUrl($pictureUrl);
      const messageList = await client.joinChatRoom(
        nickname,
        roomId,
        $pictureUrl
      );
      setActiveRoomId(roomId);
      setMessages(messageList.messages as SessionChatMessageWithId[]);
    },
    [client, setNickname, setPictureUrl, setMessages, setActiveRoomId]
  );

  const sendMessage = useCallback<UseChatClientReturn["sendMessage"]>(
    (body) => {
      if (!client) {
        throw new Error();
      }

      client.sendMessage(SocketMessageTypes.SEND_MESSAGE, { body });
    },
    [client]
  );

  const setTypingStatus = useCallback<UseChatClientReturn["setTypingStatus"]>(
    (isTyping) => {
      if (!client) {
        throw new Error();
      }
      client.sendMessage(SocketMessageTypes.SET_TYPING_PRESENCE, {
        typing: isTyping,
      });
    },
    [client]
  );

  return useMemo(
    () => ({
      createRoom,
      messages,
      joinRoom,
      activeRoomId,
      sendMessage,
      setTypingStatus,
      members,
      typingUsers,
    }),
    [
      createRoom,
      messages,
      joinRoom,
      activeRoomId,
      sendMessage,
      setTypingStatus,
      members,
      typingUsers,
    ]
  );
};
