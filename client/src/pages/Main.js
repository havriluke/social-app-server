import React, { useEffect, useState } from 'react'
import CreatePost from '../components/CreatePost'
import ListWrapper from '../components/ListWrapper'
import PostModal from '../components/modal/PostModal'
import Post from '../components/Post'
import { useFetchList } from '../hooks/useFetchList'
import { usePost } from '../hooks/usePost'
import { fetchFeed } from '../http/postsAPI'

const Main = () => {
  const [listData, setListData] = useState([])

  const [isPostModal, setIsPostModal, postParams, openModal, deletePost, editPost, createPost] = usePost(listData, setListData)
  const [increasePage, listsItems, isLoading, isEmpty, totalPages, page] = useFetchList(fetchFeed, 6)

  useEffect(() => {
    setListData(listsItems)
  }, [listsItems])

  return (
    <div>
        {isPostModal && <PostModal
          isModalActive={isPostModal}
          closeModalActive={() => {setIsPostModal(false)}}
          create={createPost}
          edit={editPost}
          params={postParams}
        />}

        <CreatePost createFunc={() => {openModal({text: '', private: false})}}/>
        <ListWrapper
          isEmpty={isEmpty}
          isLoading={isLoading}
          page={page}
          totalPages={totalPages}
          limitFunc={increasePage}
          classes={`main__list ${isEmpty ? 'empty__wrapper' : 'list'}`}
        >
          {listData.map((item) => {
            return <Post key={item.id} item={item} editFunc={() => {openModal(item)}} deleteFunc={deletePost} />
          })}
        </ListWrapper>
    </div>
  )
}

export default Main