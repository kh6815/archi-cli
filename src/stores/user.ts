import { atom } from 'recoil';

export interface UserData {
  id: string | null;
  accessToken: string | null;
  refreshToken: string | null;
}

export const userAtom = atom<UserData>({
  key: 'userKey',
  default: {
    id: null,
    accessToken: null,
    refreshToken: null,
  },
});
