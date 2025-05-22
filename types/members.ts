export type RoomMembers = {
  [id: string]: { nickname: string; pictureUrl?: string };
};

export type MemberListMessageItem = {
  socketConnectionId: string;
  permId: string;
  isHost: string;
  firebaseUid: string;
  userSettings: {
    userNickname: string;
    userIcon?: string;
  };
  isCloudPlayer: string;
};

export type MemberListSocketMessageData = MemberListMessageItem[];
