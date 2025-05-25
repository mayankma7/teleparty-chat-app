"use client";

import { useChatClient } from "@/hooks/chat-client";
import { useUser } from "@/hooks/user";
import { useMemo } from "react";

export const TypingIndicator = () => {
  const { members, typingUsers } = useChatClient();
  const { id: userId } = useUser();

  const [first, length] = useMemo(() => {
    if (
      !members ||
      !typingUsers ||
      typingUsers.length === 0 ||
      (typingUsers.length === 1 && typingUsers[0] === userId)
    ) {
      return [null, 0];
    }

    const filteredTypingUsers = typingUsers.filter((id) => id !== userId);
    const firstId = filteredTypingUsers[0];

    return [members[firstId], filteredTypingUsers.length];
  }, [members, typingUsers, userId]);

  return (
    <div className="h-10 px-2 py-1">
      {first ? (
        <div>
          <span>{first.nickname}</span>{" "}
          {length > 1 ? `and other ${length - 1} users are` : "is"} typing
        </div>
      ) : null}
    </div>
  );
};
