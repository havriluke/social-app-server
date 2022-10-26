import { observer } from 'mobx-react-lite'
import React, { useContext, useState } from 'react'
import { Context } from '..'

const Avatar = observer(({className, image, size, authorId, online, profile}) => {
    const {socket} = useContext(Context)
    const [isOnline, setIsOnline] = useState(false)

    if (online) {
        socket.emit('online', authorId, () => {
            setIsOnline(true)
        })
    }


    return (
        <div className='avatar__wrapper'>
            <div className={`avatar ${className}`}>
                <div
                    className='avatar__image'
                    style={{backgroundImage: `url(${process.env.REACT_APP_API_URL}${image})`, width: size, height: size}}>
                </div>
            </div>
            {online && isOnline && <div className='avatar__online'
                style={{border: `${profile ? '4px' : '2px'} solid var(${profile ? '--bg-color' : '--block-color'})`}}
            ></div>}
        </div>
        
    )
})

export default Avatar