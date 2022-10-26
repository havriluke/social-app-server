import {$host, $authHost} from './index'
import jwt_decode from 'jwt-decode'

export const registration = async (nickname, password) => {
    const {data} = await $host.post('api/user/registration', {nickname, password})
    localStorage.setItem('token', data.token)
    return jwt_decode(data.token)
}

export const login = async (nickname, password) => {
    const {data} = await $host.post('api/user/login', {nickname, password})
    localStorage.setItem('token', data.token)
    return jwt_decode(data.token)
}

export const check = async () => {
    const {data} = await $authHost.get('/api/user/auth')
    localStorage.setItem('token', data.token)
    return jwt_decode(data.token)
}

export const fetchUser = async (nickname) => {
    const {data} = await $host.get('/api/user/', {params: {nickname}})
    return data
}

export const fetchUserById = async (id) => {
    const {data} = await $authHost.get('/api/user/byid', {params: {id}})
    return data
}
export const confirmPassword = async (password) => {
    const {data} = await $authHost.get('/api/user/confirm', {params: {password}})
    return data
}

export const editUser = async (user) => {
    const {data} = await $authHost.put('/api/user', user)
    return data
}

export const setBan = async (id, daysCount) => {
    const {data} = await $authHost.put('/api/user/ban', {id, daysCount})
    return data
}

export const dropBan = async (id) => {
    const {data} = await $authHost.put('/api/user/remove-ban', {id})
    return data
}