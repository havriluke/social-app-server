export const ADMIN_ROUTE = '/admin'
export const REGISTRATION_ROUTE = '/registration'
export const LOGIN_ROUTE = '/login'
export const PAGE_ROUTE = '/page'
export const FRIENDS_ROUTE = '/friends'
export const CHATS_ROUTE = '/chats'
export const CHAT_ROUTE = '/chat'
export const MAIN_ROUTE = '/'

console.log(process.env)
export const REACT_APP_API_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:5000/' : 'https://social-kreep.herokuapp.com/'