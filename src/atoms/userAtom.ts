import { atom } from 'recoil';

export const getUserFromCookies = () => {
    if (typeof document !== 'undefined') {
        const cookieString = document.cookie
            .split('; ')
            .find(row => row.startsWith('user='));
        if (cookieString) {
            const userCookie = cookieString.split('=')[1];
            return JSON.parse(decodeURIComponent(userCookie));
        }
    }
    return {
        id: '',
        email: '',
        name: '',
        picture: '',
    };
};
type User = {
    id: string;
    email: string;
    name: string;
    picture: string;
} | null;
export const userAtom = atom<User>({
    key: 'userAtom',
    default: {
        id: '',
        email: '',
        name: '',
        picture: '',
    },
});
