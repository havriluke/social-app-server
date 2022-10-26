import React, { useState } from 'react'

const Notification = ({nickname, message, active, closeFunc}) => {
    const [isActive, setIsActive] = useState(active)

    return (
        <div className={`notification component ${!isActive ? 'hide' : ''}`}>
            <div className='notification__close' onClick={closeFunc}></div>
            <div className='notification__content'>
                <div className='notification__icon'></div>
                <div className='notification__nickname'>{nickname}</div>
                <div className='notification__message'>{message}</div>
            </div>
        </div>
    )
}

export default Notification