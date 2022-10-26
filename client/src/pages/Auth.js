import { observer } from 'mobx-react-lite'
import React, { useContext, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { login, registration } from '../http/userAPI'
import { Context } from '../index'
import '../styles/auth.css'
import { LOGIN_ROUTE, REGISTRATION_ROUTE } from '../utils/const'

const Auth = observer(() => {
    const {user} = useContext(Context)
    const location = useLocation()
    const isLogin = location.pathname === LOGIN_ROUTE
    const navigate = useNavigate()
    const [nickname, setNickname] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const passElem = useRef()

    const submit = async (e) => {
        e.preventDefault()
        try {
            let data
            if (isLogin) {
                data = await login(nickname, password)
            } else {
                data = await registration(nickname, password)
            }
            console.log(data)
            user.setUser(data)
            user.setIsAuth(true)
            navigate(0)
        } catch (error) {
            setError(error.response.data.message)
        }
    }

    const handleKeypressLog = e => {
        if (e.charCode === 13) {
            passElem.current.focus()
        }
    }
    const handleKeypressPass = e => {
        if (e.charCode === 13) {
            submit(e)
        }
    }

    return (
        <div className='auth component container'>
            <div className='auth__title'>{isLogin ? 'Авторизація' : 'Реєстрація'}</div>
            <div className='auth__form form'>
                <input
                    className='auth__input'
                    type={'text'}
                    placeholder={'Нікнейм'}
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    autoFocus
                    onKeyPress={handleKeypressLog}
                />
                <input
                    ref={passElem}
                    className='auth__input'
                    type={'password'}
                    placeholder={'Пароль'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyPress={handleKeypressPass}
                />
                <div className='form__buttons'>
                    <div className='auth_change-type'>
                        <a className='change-type__text'>{isLogin ? 'Не зареєстровані?' : 'Вже зареєстровані?'}</a>
                        <a
                            className='change-type__button'
                            onClick={() => navigate(isLogin ? REGISTRATION_ROUTE : LOGIN_ROUTE)}>
                                {isLogin ? 'Реєстрація' : 'Авторизація'}
                        </a>
                    </div>
                    <button className='auth__button green clickable' onClick={submit}>Підтвердити</button>
                </div>
            </div>
            <div className='error'>{error}</div>
        </div>
    )
})

export default Auth