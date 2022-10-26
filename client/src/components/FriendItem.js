import React, { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { PAGE_ROUTE } from '../utils/const'
import Avatar from './Avatar'

const FriendItem = ({children, friend}) => {
    const navigate = useNavigate()

    return (
        <div
            className='friends__item clickable'
            onClick={(e) => {
                if (e.target.classList.contains('friends__button')) return
                if (e.target.classList.contains('admin__button')) return
                navigate(`${PAGE_ROUTE}/${friend.nickname}`)
            }}
        >
            <div className='friends__account'>
                <Avatar image={friend.photo} size={60} authorId={friend.id} online />
                <div className='friends__nickname'>{friend.nickname}</div>
            </div>
            {children}
        </div>
    )
}

export default FriendItem