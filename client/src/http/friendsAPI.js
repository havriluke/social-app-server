import { $authHost, $host } from "./index";


export const fetchAll = async (limit, page) => {
    const {data} = await $authHost.get('api/friends/all', { params: {limit, page} })
    return data
}

export const fetchFriends = async (limit, page) => {
    const {data} = await $authHost.get('api/friends/accepted', { params: {limit, page} })
    return data
}

export const fetchRequests = async (limit, page) => {
    const {data} = await $authHost.get('api/friends/requests', { params: {limit, page} })
    return data
}

export const fetchUserRequests = async (limit, page) => {
    const {data} = await $authHost.get('api/friends/user-requests', { params: {limit, page} })
    return data
}

export const sendRequest = async (id) => {
    const {data} = await $authHost.post('api/friends', {id})
    return data
}

export const acceptRequest = async (id) => {
    const {data} = await $authHost.put('api/friends', {id})
    return data
}

export const removeFriendship = async (id) => {
    const {data} = await $authHost.delete('api/friends', {data: {id}})
    return data
}

export const fetchFriendsById = async (limit, page, id) => {
    const {data} = await $authHost.get('api/friends', {params: {id, page, limit}})
    return data
}

export const fetchFriendship = async (userId, friendId) => {
    const {data} = await $authHost.get('api/friends/friend', {params: {userId, friendId}})
    return data
}

export const fetchSearchPeople = async (limit, page, nickname) => {
    const {data} = await $authHost.get('api/friends/search', {params: {nickname, page, limit}})
    return data
}