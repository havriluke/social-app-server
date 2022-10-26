import { observer } from 'mobx-react-lite'
import React, { useEffect, useState, useMemo, useContext } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import CheckLine from '../components/CheckLine'
import FriendItem from '../components/FriendItem'
import ListWrapper from '../components/ListWrapper'
import Loader from '../components/Loader'
import Post from '../components/Post'
import WallProfile from '../components/WallProfile'
import { useFetchList } from '../hooks/useFetchList'
import { fetchFriendsById } from '../http/friendsAPI'
import { fetchPosts } from '../http/postsAPI'
import { fetchUser } from '../http/userAPI'
import '../styles/wall.css'
import '../styles/modal.css'
import PostModal from '../components/modal/PostModal'
import { usePost } from '../hooks/usePost'
import CreatePost from '../components/CreatePost'
import { Context } from '..'
import { MAIN_ROUTE } from '../utils/const'

const Wall = observer(() => {
  const navigate = useNavigate()
  const {user} = useContext(Context)
  const {nickname} = useParams()
  const [author, setAuthor] = useState({})
  const [type, setType] = useState(0)
  const [wallType, setWallType] = useState(0)
  const [isAuthorLoading, setIsAuthorLoading] = useState(true)
  const [listData, setListData] = useState([])

  const fetchFunc = useMemo(() => {
    if (type === 0) return fetchPosts
    else if (type === 1) return fetchFriendsById
  }, [type])

  const checkLineItems = [
    {title: 'Дописи', onclick: () => {setType(0)}},
    {title: 'Друзі', onclick: () => {setType(1)}},
  ]

  const [isPostModal, setIsPostModal, postParams, openModal, deletePost, editPost, createPost] = usePost(listData, setListData)
  const [increasePage, listsItems, isLoading, isEmpty, totalPages, page] = useFetchList(fetchFunc, 10, author.id)

  const resetData = () => {
    setIsAuthorLoading(true)
    setAuthor({})
    setListData([])
    setType(0)
  }

  useEffect(() => {
    resetData()
    fetchUser(nickname).then(data => {
      setAuthor(data)
    }).catch(e => {
      console.log(e.response.data.message)
      navigate(MAIN_ROUTE)
    }).finally(() => setIsAuthorLoading(false))
  }, [nickname])

  useEffect(() => {
    setListData(listsItems)
    setWallType(type)
  }, [listsItems])
 
  return (
    <div className='wall'>
      
      {isPostModal && <PostModal
        isModalActive={isPostModal}
        closeModalActive={() => {setIsPostModal(false)}}
        create={createPost}
        edit={editPost}
        params={postParams}
      />}
      {isAuthorLoading ?
        <Loader styles={{transform: 'translate(-20px, 30px)'}} />
        :
        <WallProfile author={author} />
      }

      <div className='wall__panel panel'>
        <CheckLine items={checkLineItems} type={type} />
      </div>

      {author.id === user.user.id && type === 0 &&
        <CreatePost createFunc={() => {openModal({text: '', private: false})}}/>
      }
      {!isAuthorLoading &&
        <ListWrapper
          isEmpty={isEmpty}
          isLoading={isLoading}
          page={page}
          totalPages={totalPages}
          limitFunc={increasePage}
          classes={`wall__list ${isEmpty ? 'empty__wrapper' : 'list'} ${type ? 'component' : ''}`}
        >
          {listData.map((item) => {
            if (wallType === 0) {
              return <Post key={item.id} item={item} editFunc={() => {openModal(item)}} deleteFunc={deletePost} />
            }
            else if (wallType === 1) {
              return <FriendItem key={item.id} friend={item}></FriendItem>
            }
          })}
        </ListWrapper>
      }

    </div>
  )
})

export default Wall