import { $authHost, $host } from "./index";

export const addMessage = async (friendId, text) => {
    const {data} = await $authHost.post('api/messages', { friendId, text })
    return data
}

export const removeMessage = async (id) => {
    const {data} = await $authHost.delete('api/messages', { data: { id }})
    return data
}

export const removeChat = async (id) => {
    const {data} = await $authHost.delete('api/messages/chat', { data: { id }})
    return data
}

export const updateMessage = async (id, text) => {
    const {data} = await $authHost.put('api/messages', { id, text })
    return data
}

export const fetchChat = async (limit, page, id) => {
    const {data} = await $authHost.get('api/messages/chat', { params: {id, limit, page} })
    return data
}

export const fetchChats = async (limit, page) => {
    const {data} = await $authHost.get('api/messages', { params: {limit, page} })
    return data
}

export const fetchChatInfo = async (id) => {
    const {data} = await $authHost.get('/api/messages/chat-info', { params: {id} })
    return data
}

export const fetchChatByUser = async (id) => {
    const {data} = await $authHost.get('api/messages/chat-user', { params: {id} })
    return data
}

export const readMessages = async (id) => {
    const {data} = await $authHost.put('api/messages/read', {id})
    return data
}

export const fetchUnreadMessages = async () => {
    const {data} = await $authHost.get('api/messages/unread')
    return data
}