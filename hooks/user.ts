import { create } from "zustand";

type User = {
  id?: string;
  nickname: string;
  pictureUrl?: string;
  setId: (value: string) => void;
  setNickname: (value: string) => void;
  setPictureUrl: (url: string | undefined) => void;
};

export const useUser = create<User>((set) => ({
  id: undefined,
  nickname: "",
  pictureUrl: undefined,
  setId: (value) => set((state) => ({ ...state, id: value })),
  setNickname: (value) => set((state) => ({ ...state, nickname: value })),
  setPictureUrl: (url) => set((state) => ({ ...state, pictureUrl: url })),
}));
