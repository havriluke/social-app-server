import { observer } from 'mobx-react-lite'
import React, { useContext, useEffect, useMemo, useState } from 'react'
import { Context } from '..'
import ChatItem from '../components/ChatItem'
import ListWrapper from '../components/ListWrapper'
import { useFetchList } from '../hooks/useFetchList'
import { fetchChats } from '../http/messagesAPI'
import '../styles/chats.css'

const Chats = observer(() => {
  const {user, socket} = useContext(Context)
  const [listData, setListData] = useState([])

  const [increasePage, listsItems, isLoading, isEmpty, totalPages, page] = useFetchList(fetchChats, 10)

  const deleteItem = async (id) => {
    setListData(listData.filter(ld => ld.id !== id))
  }

  socket.on('notification-message', (message, chatId) => {
    if (!listData.length) return
    const currentMessage = listData.filter(lt => lt.chatId === parseInt(chatId))[0]
    message['companion'] = currentMessage.companion
    message['unreadCount'] = currentMessage.unreadCount + 1
    setListData([message, ...listData.filter(ld => ld.chatId !== parseInt(chatId))])
  })

  useEffect(() => {
    setListData(listsItems)
  }, [listsItems])

  return (
    <div className={'chats'}>
        
        <ListWrapper
          isEmpty={isEmpty}
          isLoading={isLoading}
          page={page}
          totalPages={totalPages}
          limitFunc={increasePage}
          classes={`chats__list component ${isEmpty ? '' : 'list'}`}
        >
          {listData.map((item) => {
            return <ChatItem key={item.id} item={item} userId={user.user.id} deleteFunc={deleteItem} />
          })}
        </ListWrapper>
    </div>
  )
})

export default Chats