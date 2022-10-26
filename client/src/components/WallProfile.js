import { observer } from 'mobx-react-lite'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Context } from '..'
import { acceptRequest, fetchFriendsById, fetchFriendship, sendRequest } from '../http/friendsAPI'
import { fetchChatByUser } from '../http/messagesAPI'
import { fetchPosts } from '../http/postsAPI'
import { CHAT_ROUTE } from '../utils/const'
import MessageModal from './modal/MessageModal'
import mailAdd from '../assets/logos/mail-add-line.svg'
import userAdd from '../assets/logos/user-add-line.svg'
import accIcon from '../assets/logos/user-settings-line.svg'
import AccountModal from './modal/AccountModal'
import Avatar from './Avatar'

const WallProfile = observer(({author}) => {
    const {user} = useContext(Context)
    const navigate = useNavigate()
    const [isModalActive, setIsModalActive] = useState(false)
    const [isAccActive, setIsAccActive] = useState(false)
    const [isAddButton, setIsAddButton] = useState(false)
    const [isRequested, setIsRequested] = useState(false)
    const [postCount, setPostCount] = useState(0)
    const [friendCount, setFriendCount] = useState(0)

    useEffect(() => {
        fetchFriendship(user.user.id, author.id).then(data => {
            setIsAddButton((!data || data.friendId === user.user.id && !data.accepted) && user.user.id !== author.id)
            setIsRequested(Boolean(data))
        })
        fetchFriendsById(1, 1, author.id).then((data) => {
            setFriendCount(data.count)
        })
        fetchPosts(1, 1, author.id).then((data) => {
            setPostCount(data.count)
        })
    }, [author.id])

    const addFriend = async () => {
        setIsAddButton(false)
        if (isRequested) {
            await acceptRequest(author.id)
        } else {
            await sendRequest(author.id)
        }
    }

    const sendMessage = () => {
        fetchChatByUser(author.id).then((data) => {
            if (Boolean(data)) {
                navigate(CHAT_ROUTE+'/'+data.id)
            } else {
                setIsModalActive(true)
            }
        })
    }

    return (
        <div className='wall-profile component'>
            <MessageModal isActive={isModalActive} closeFunc={() => {setIsModalActive(false)}} user={user.user} friend={author} />
            <AccountModal isActive={isAccActive} closeFunc={() => {setIsAccActive(false)}} />
            
            <Avatar image={author.photo} size={150} authorId={author.id} profile online  />
            <div className='wall-profile__info'>
                <div className='wall-profile__nickname'>{author.nickname}</div>
                <div className='wall-profile__cells'>
                    <div className='wall-profile__counts'>
                        <div className='wall-profile__count'>{friendCount}<div>друзі</div></div>
                        <div className='wall-profile__count'>{postCount}<div>пости</div></div>
                    </div>
                    <div className='wall-profile__buttons'>
                        {isAddButton &&
                        <button className='wall-profile__button green clickable' onClick={addFriend}><img src={userAdd} /></button>}
                        {user.user.id !== author.id &&
                        <button className='wall-profile__button clickable' onClick={sendMessage}><img src={mailAdd} /></button>}
                        {user.user.id === author.id &&
                        <button className='wall-profile__button clickable' onClick={() => {setIsAccActive(true)}}><img src={accIcon} /></button>}
                    </div>
                </div>
            </div>

            
            
            
        </div>
    )
})

export default WallProfile