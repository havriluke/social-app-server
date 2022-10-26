import Admin from "./pages/Admin";
import Auth from "./pages/Auth";
import Chat from "./pages/Chat";
import Chats from "./pages/Chats";
import Main from "./pages/Main"
import Friends from "./pages/Friends";
import Wall from "./pages/Wall";
import { ADMIN_ROUTE, REGISTRATION_ROUTE, LOGIN_ROUTE, PAGE_ROUTE, FRIENDS_ROUTE, CHATS_ROUTE, CHAT_ROUTE, MAIN_ROUTE } from "./utils/const";

export const adminRoutes = [
    {
        path: ADMIN_ROUTE,
        Component: <Admin/>
    }
]

export const authRoutes = [
    {
        path: MAIN_ROUTE,
        Component: <Main/>
    },
    {
        path: CHAT_ROUTE + '/:nickname',
        Component: <Chat/>
    },
    {
        path: CHATS_ROUTE,
        Component: <Chats/>
    },
    {
        path: FRIENDS_ROUTE,
        Component: <Friends/>
    },
    {
        path: PAGE_ROUTE + '/:nickname',
        Component: <Wall/>
    }
]

export const unAuthRoutes = [
    {
        path: LOGIN_ROUTE,
        Component: <Auth/>
    },
    {
        path: REGISTRATION_ROUTE,
        Component: <Auth/>
    },
]