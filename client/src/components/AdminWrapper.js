import React, { useContext, useRef, useState } from 'react'
import { dropBan, setBan } from '../http/userAPI'
import FriendItem from './FriendItem'
import {Context} from '..'
import { observer } from 'mobx-react-lite'

const AdminWrapper = observer(({item}) => {
    const {socket} = useContext(Context)
    const [isBanned, setIsBanned] = useState(Boolean(item.banStatus))

    const ban = async (days) => {
        setIsBanned(true)
        await setBan(item.id, days)
        socket.emit('set-ban', item.id)
    }
    const removeBan = async () => {
        setIsBanned(false)
        await dropBan(item.id)
    }

    return (
        <FriendItem friend={item}>
            <div className='admin__groups'>
                {!isBanned && <div className='admin-buttons ban-group'>
                    <button onClick={() => {ban(3)}} className='admin__button red clickable'>3d</button>
                    <button onClick={() => {ban(10)}} className='admin__button red clickable'>10d</button>
                    <button onClick={() => {ban(30)}} className='admin__button red clickable'>30d</button>
                </div>}
                {isBanned &&
                    <button onClick={removeBan} className='admin__button green clickable'>Скасувати</button>
                }
            </div>
        </FriendItem>
    )
})

export default AdminWrapper