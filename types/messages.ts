import { SessionChatMessage } from "teleparty-websocket-lib";

export type ChatMessage = Pick<
  SessionChatMessage,
  "userNickname" | "userIcon" | "body" | "timestamp"
> & {
  id: SessionChatMessage["permId"];
};
