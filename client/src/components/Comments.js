import React, { useContext, useEffect, useMemo, useState } from 'react'
import { addComment, fetchComments, removeComment } from '../http/postsAPI'
import ListWrapper from './ListWrapper'
import { useNavigate } from 'react-router-dom'
import { PAGE_ROUTE } from '../utils/const'
import sendPlane from '../assets/logos/send-plane-fill.svg'
import { useFetchList } from '../hooks/useFetchList'
import { observer } from 'mobx-react-lite'
import { Context } from '..'
import MessageInput from './MessageInput'

const Comments = observer(({postId, increaseCount, decreaseCount}) => {
    const {user} = useContext(Context)
    const [comments, setComments] = useState([])
    const [currentComment, setCurrentComment] = useState('')
    const navigate = useNavigate()

    const [increasePage, listsItems, isLoading, isEmpty, totalPages, page] = useFetchList(fetchComments, 10, postId)

    const createComment = () => {
        addComment(postId, currentComment).then((data) => {
            setComments([...comments, data])
            increaseCount()
            setCurrentComment('')
        }).catch((error) => {
            console.log(error.response.data.message);
        })
    }

    const deleteComment = (id) => {
        removeComment(id).then(() => {
            setComments(comments.filter(c => c.id !== id))
            decreaseCount()
        }).catch((error) => {
            console.log(error.response.data.message)
        })
    }

    useEffect(() => {
        if (!listsItems.length) return
        setComments([...listsItems])
    }, [listsItems.length])

    return (
        <div className='post__comments'>
            <ListWrapper
                classes={`post-comments__list ${isEmpty ? 'empty__wrapper_comment' : 'list'}`}
                isEmpty={!comments.length}
                isLoading={isLoading}
                page={page}
                totalPages={totalPages}
                limitFunc={() => {increasePage()}}
            >
                {comments.map((comment, index) => {
                    return <div key={index} className='post-comments__comment'>
                        <div className='comment__nickname'
                            onClick={() => {navigate(PAGE_ROUTE+'/'+comment.user.nickname)}}
                        >
                            {comment.user.nickname}
                        </div>
                        <div className='comment__text'>{comment.text}</div>
                        {(user.user.id === comment.user.id || user.user.role === 'ADMIN') &&
                            <div className='comment__delete' onClick={() => {deleteComment(comment.id)}}></div>}
                    </div>
                })}
            </ListWrapper>

            <MessageInput
                className={'post-comments__form'}
                placeholder={'Ваш коментар'}
                value={currentComment}
                onChange={(e) => setCurrentComment(e.target.value)}
                onClick={createComment}
            />


        </div>
    )
})

export default Comments