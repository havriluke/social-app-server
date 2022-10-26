import { observer } from 'mobx-react-lite'
import React, { useContext, useRef } from 'react'
import { Context } from '..'
import { removeFriendship, acceptRequest } from '../http/friendsAPI'
import FriendItem from './FriendItem'

const FriendWrapper = observer(({friend, type}) => {
    const {socket} = useContext(Context)
    const element = useRef()

    const remove = async (obj) => {
        element.current.remove()
        await removeFriendship(obj.id)
    }
    const accept = async (obj) => {
        element.current.remove()
        await acceptRequest(obj.id)
    }
    const cancelRequest = async (obj) => {
        element.current.remove()
        await removeFriendship(obj.id)
        socket.emit('cancel-request', friend.id)
    }


    return (
        <FriendItem friend={friend}>
            <div ref={element} className='friends__buttons'>
                {type === 1 &&
                <button onClick={() => {remove(friend)}} className='friends__button red clickable'>Відхилити</button>}
                {type === 1 &&
                <button onClick={() => {accept(friend)}} className='friends__button green clickable'>Прийняти</button>}
                {type === 2 &&
                <button onClick={() => {cancelRequest(friend)}} className='friends__button red clickable'>Скасувати</button>}
                {type === 0 &&
                <button onClick={() => {remove(friend)}} className='friends__button red clickable'>Видалити</button>}
            </div>
        </FriendItem>
    )
})

export default FriendWrapper