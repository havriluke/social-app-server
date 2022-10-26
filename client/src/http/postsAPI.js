import { $authHost, $host } from "./index";

export const fetchPosts = async (limit, page, id) => {
    const {data} = await $authHost.get('api/posts/user', { params: {limit, page, id} })
    return data
}

export const fetchLikes = async (id) => {
    const {data} = await $authHost.get('api/posts/like', { params: {id} })
    return data
}

export const fetchComments = async (limit, page, id) => {
    const {data} = await $authHost.get('api/posts/comment', {params: {limit, page, id}})
    return data
}

export const toggleLike = async (id) => {
    const {data} = await $authHost.post('api/posts/like', {id})
    return data
}

export const addComment = async (id, text) => {
    const {data} = await $authHost.post('api/posts/comment', {id, text})
    return data
}

export const removeComment = async (id) => {
    const {data} = await $authHost.delete('api/posts/comment', {data: {id}})
    return data
}

export const addPost = async (post) => {
    const {data} = await $authHost.post('api/posts', post)
    return data
}

export const removePost = async (id) => {
    const {data} = await $authHost.delete('api/posts', {data: {id}})
    return data
}

export const updatePost = async (post) => {
    const {data} = await $authHost.put('api/posts', post)
    return data
}

export const fetchFeed = async (limit, page) => {
    const {data} = await $authHost.get('api/posts', {params: {limit, page}})
    return data
}