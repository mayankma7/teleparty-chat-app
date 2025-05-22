"use client";

import { useChatClient } from "@/hooks/chat-client";
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover";

export const MemberList = () => {
  const { members } = useChatClient();

  const entries = members ? Object.entries(members) : [];

  return (
    <Popover>
      <PopoverTrigger disabled={entries.length === 0}>
        Members ({entries.length})
      </PopoverTrigger>
      <PopoverContent>
        <ul className="list-none p-2 m-0">
          {entries.map(([id, details]) => (
            <div key={id} className="flex gap-2">
              <span>{details.nickname}</span>
            </div>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  );
};
