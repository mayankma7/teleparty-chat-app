"use client";

import { useCallback, useMemo } from "react";
import { useChatClient } from "./chat-client";

export const useChatRoom = () => {
  const client = useChatClient();
};
