import { observer } from 'mobx-react-lite'
import React, { useContext, useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Context } from '..'
import Loader from '../components/Loader'
import { addMessage, fetchChat, fetchChatInfo, readMessages, removeMessage, updateMessage } from '../http/messagesAPI'
import { fetchUserById } from '../http/userAPI'
import '../styles/chat.css'
import { MAIN_ROUTE, PAGE_ROUTE } from '../utils/const'
import ListWrapper from '../components/ListWrapper'
import { useFetchList } from '../hooks/useFetchList'
import MessageList from '../components/MessageList'
import MessageInput from '../components/MessageInput'

const Chat = observer(() => {
  const {user, socket} = useContext(Context)
  const navigate = useNavigate()
  const locationPath = useLocation().pathname
  const [companion, setCompanion] = useState({})
  const [isCompanionLoading, setIsCompanionLoading] = useState(true)
  const [editId, setEditId] = useState(null)
  const [currentMessage, setCurrentMessage] = useState('')
  const [messages, setMessages] = useState([])
  const [typing, setTyping] = useState(false)
  let timeoutsIds = []

  const chatId = useMemo(() => {
    return locationPath.split('/').slice(-1)
  }, [locationPath])


  socket.on('send-message', (message) => {
    message['read'] = true
    setMessages([message, ...messages])
    readMessages(chatId).catch(() => {})
    socket.emit('edit-messages', [message], chatId)
  })
  socket.on('edit-messages', (data) => {
    const dataIds = data.map(d => d.id)
    setMessages(messages.map(m => {
      return dataIds.includes(m.id) ? data.filter(d => d.id === m.id)[0] : m
    }))
  })
  socket.on('delete-message', (data) => {
    setMessages(messages.filter(m => m.id !== data.id))
  })
  socket.on('type', () => {
    setTyping(true)
    timeoutsIds.forEach((ti) => clearTimeout(ti))
    timeoutsIds = []
    timeoutsIds.push(setTimeout(() => {
      setTyping(false)
    }, 2000))
  })

  useEffect(() => {
    if (!chatId) return
    fetchChatInfo(chatId).then(data => {
      const companionId = data.userOneId === user.user.id ? data.userTwoId : data.userOneId
      fetchUserById(companionId).then(userObj => {
        setCompanion(userObj)
      }).then(() => {
        socket.emit('join-room', chatId)
        setIsCompanionLoading(false)
      })
    }).catch(() => {
      navigate(MAIN_ROUTE)
      setCompanion(null)
    })
  }, [])

  const [increasePage, listsItems, isLoading, isEmpty, totalPages, page] = useFetchList(fetchChat, 100, chatId)

  useEffect(() => {
    const tempMessages = listsItems.sort((a, b) => b.datetime - a.datetime)
    setMessages(tempMessages)
    socket.emit('edit-messages', [...tempMessages], chatId)
  }, [listsItems])

  const sendMessage = () => {
    addMessage(companion.id, currentMessage).then((data) => {
      setMessages([data.message, ...messages])
      socket.emit('send-message', chatId, data.message, companion.id)
    }).catch((e) => {
      console.log(e.response.data.message);
    }).finally(() => {
      setCurrentMessage('')
    })
  }

  const editMessage = (id, text) => {
    setCurrentMessage(text)
    setEditId(id)
  }
  const confirmEdit = () => {
    updateMessage(editId, currentMessage).then((data) => {
      setMessages(messages.map(m => m.id === data.id ? data : m))
      socket.emit('edit-messages', [data], chatId)
    }).catch((e) => {
      console.log(e.response.data.message);
    }).finally(() => {
      setEditId(null)
      setCurrentMessage('')
    })
  }

  const deleteMessage = (id) => {
    removeMessage(id).then((data) => {
      setMessages(messages.filter(m => m.id !== data.id))
      socket.emit('delete-message', data, chatId)
    }).catch((e) => {
      console.log(e.response.data.message);
    })
  }

  return (
    <div className='chat component'>
        {isCompanionLoading && <Loader classes={'list-loader'} />}
        {!isCompanionLoading && <div className='chat__companion chat-companion'>
          <div className='chat-companion__nickname' onClick={() => {navigate(PAGE_ROUTE+'/'+companion.nickname)}}>{companion.nickname}</div>
          {<div className={`chat__write ${typing ? 'active' : ''}`}><div></div><div></div><div></div>{typing ? 'пише' : ''}</div>}
        </div>}

        <ListWrapper
          isEmpty={isEmpty}
          isLoading={isLoading}
          page={page}
          totalPages={totalPages}
          limitFunc={increasePage}
          classes={`chat-list chat__list ${isEmpty ? '' : 'list'}`}
        >
          <MessageList items={messages} userId={user.user.id} companion={companion} editFunc={editMessage} deleteFunc={deleteMessage} />
        </ListWrapper>

        <MessageInput
          className={'chat__message'}
          placeholder={'Ваше повідомлення'}
          value={currentMessage}
          onChange={(e) => {
            setCurrentMessage(e.target.value)
            socket.emit('type', chatId)
          }}
          onClick={editId ? confirmEdit : sendMessage}
          edit={Boolean(editId)}
        />

    </div>
  )
})

export default Chat