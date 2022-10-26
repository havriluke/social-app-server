import React, { useEffect, useState } from 'react'
import '../styles/message.css'
import Message from './Message'

const MessageList = ({items, userId, companion, editFunc, deleteFunc}) => {
    const interval = 60000 * 5
    const [messages, setMessages] = useState([])

    useEffect(() => {
        items.reverse().forEach((item, index) => {
            item['first'] = true
            if (!items[index-1]) {
                item['newDay'] = true
                return
            }
            items[index-1]['first'] = item.datetime - items[index-1].datetime > interval || item.userId !== items[index-1].userId
            item['newDay'] = new Date(item.datetime).getDate() !== new Date(items[index-1].datetime).getDate()
        })
    }, [items])

    useEffect(() => {
        if (!items.length) return
        setMessages([...items.sort((a, b) => b.datetime - a.datetime)])
    }, [items])

    return (
        <>
            {messages.map((item) => {
                return <Message
                    key={item.id}
                    item={item}
                    userId={userId}
                    companion={companion}
                    editFunc={editFunc}
                    deleteFunc={deleteFunc}
                    chatElem={document.querySelector('.chat__list')}
                />
            })}
        </>
    )
}

export default MessageList