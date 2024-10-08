import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';

const { persistAtom } = recoilPersist();

export interface UserData {
  id: string | null;
  accessToken: string | null;
  refreshToken: string | null;
  role: string | null;
  imgUrl: string | null;
  nickName: string | null;
}

export const userAtom = atom<UserData>({
  key: 'userKey',
  default: {
    id: null,
    accessToken: null,
    refreshToken: null,
    role: null,
    imgUrl: null,
    nickName: null,
  },
  effects_UNSTABLE: [persistAtom]
});
