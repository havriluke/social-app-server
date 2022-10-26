import { observer } from 'mobx-react-lite'
import React, { useEffect, useMemo, useState } from 'react'
import CheckLine from '../components/CheckLine'
import FriendWrapper from '../components/FriendWrapper'
import ListWrapper from '../components/ListWrapper'
import Search from '../components/Search'
import { useFetchList } from '../hooks/useFetchList'
import { fetchFriends, fetchPeople, fetchRequests, fetchSearchPeople, fetchUserRequests } from '../http/friendsAPI'
import '../styles/friends.css'

const Friends = observer(() => {
  const [listData, setListData] = useState([])
  const [type, setType] = useState(0)
  const [isSearchActive, setIsSearchActive] = useState(false)
  const [searchReq, setSearchReq] = useState('')

  const fetchFunc = useMemo(() => {
    if (type === 0) return fetchFriends
    else if (type === 1) return fetchRequests
    else if (type === 2) return fetchUserRequests
    else if (type === 3) return fetchSearchPeople
  }, [type])

  const checkLineItems = [
    { title: 'Друзі',  onclick: () => {setType(0)} },
    { title: 'Запити', onclick: () => {setType(1)} },
    { title: 'Мої запити', onclick: () => {setType(2)} }
  ]

  const [increasePage, listsItems, isLoading, isEmpty, totalPages, page] = useFetchList(fetchFunc, 10, searchReq)

  useEffect(() => {
    setListData([...listsItems])
  }, [listsItems])

  const activeSearch = () => {
    if (type === 3) setType(0)
    else setType(3)
    setIsSearchActive(!isSearchActive)
  }

  return (
    <div className='friends'>
        
      <div className='friends__panel panel'>
        {!isSearchActive && <CheckLine type={type} items={checkLineItems} search />}
        <Search active={isSearchActive}
          activeFunc={activeSearch}
          value={searchReq}
          setValueFunc={setSearchReq}
        />
      </div>

      <ListWrapper
        isEmpty={isEmpty}
        page={page}
        totalPages={totalPages}
        limitFunc={() => { increasePage() }}
        isLoading={isLoading}
        classes={`friends__list component ${isEmpty ? '' : ' list'}`}
      >
        {listData.map(friend => {
          return <FriendWrapper key={friend.id} friend={friend} type={type}></FriendWrapper>
        })}
        
      </ListWrapper>

    </div>
  )
})

export default Friends