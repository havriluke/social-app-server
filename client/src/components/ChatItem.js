import React, { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { CHAT_ROUTE } from '../utils/const'
import dots from '../assets/logos/more-fill-black.svg'
import DropDownList from './DropDownList'
import { removeChat } from '../http/messagesAPI'
import Avatar from './Avatar'

const ChatItem = ({item, userId, deleteFunc}) => {
    const navigate = useNavigate()
    
    const dropDownItems = [
        {title: 'Чат', classes: 'title', onclick: () => {}},
        {title: 'Видалити', classes: 'red', onclick: () => {
            removeChat(item.chatId).then(() => {
                deleteFunc(item.id, item.chatId)
            })
        }}
    ]

    const handleClick = (e) => {
        if ([...e.target.classList].includes('drop-down__logo')) return
        navigate(CHAT_ROUTE+'/'+item.chatId)
    }

    const getDate = (dateNumber) => {
        const date = new Date(dateNumber)
        return `${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`
    }

    return (
        <div onClick={handleClick} className='chats__item chat-item clickable'>
            <div className='chat-item__photo'>
                <Avatar image={item.companion.photo} size={60} authorId={item.companion.id} online />
            </div>
            <div className='chat-item__content'>
                <div className='chat-item__top'>
                    <div className='chat-item__nickname'>{item.companion.nickname}</div>
                    <div className='chat-item__info'>
                        <DropDownList
                            listPosition={{top: -5, right: 25}}
                            items={dropDownItems} image={dots}
                            className={'chat-item__drop-down'}
                            scrollBgElem={window}
                        />
                        <div className='chat-item__datetime'>{getDate(item.datetime)}</div>
                    </div>
                </div>
                <div className='chat-item__bottom'>
                    <div className='chat-item__text-line'>
                        {item.userId === userId && <div className='chat-item__author'>{'Ви:'}</div>}
                        <div className='chat-item__text'>{item.text}</div>
                    </div>
                    <div className='chat-item__icons'>
                        {item.userId === userId && !item.read && <div className='chat-item__icon chat-item__icon_s'></div>}
                        {item.userId !== userId && !item.read && <div className='chat-item__icon chat-item__icon_r'>
                            <div>{item.unreadCount}</div>
                        </div>}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChatItem