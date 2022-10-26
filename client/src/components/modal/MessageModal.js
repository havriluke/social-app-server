import React, { useState } from 'react'
import Modal from './Modal'
import plane from '../../assets/logos/send-plane-fill.svg'
import { useNavigate } from 'react-router-dom'
import { addMessage } from '../../http/messagesAPI'
import { CHAT_ROUTE } from '../../utils/const'
import MessageInput from '../MessageInput'
import Avatar from '../Avatar'

const MessageModal = ({isActive, closeFunc, user, friend}) => {
    const navigate = useNavigate()
    const [message, setMessage] = useState('')

    const sendMessage = () => {
        addMessage(friend.id, message).then((data) => {
            navigate(CHAT_ROUTE+'/'+data.chat.id)
        }).catch((e) => {
            console.log(e.response.data.message);
        })
    }

    return (
        <Modal title={'Напишіть повідомлення'} isActive={isActive} closeModal={closeFunc}>
            <div className='message-modal'>
                <div className='message-modal__text'>Ви пишете до {friend.nickname}</div>
                <div className='message-modal__message'>
                    <Avatar image={user.photo} size={50} />
                    <MessageInput 
                        className={'message-modal__input'}
                        onChange={(e) => {setMessage(e.target.value)}}
                        onClick={sendMessage}
                        value={message}
                        placeholder={'Ваше повідомлення'}
                    />
                </div>
            </div>
        </Modal>
    )
}

export default MessageModal