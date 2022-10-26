import { useEffect, useState } from 'react'
import { fetchComments, fetchLikes, toggleLike } from '../http/postsAPI'

export const usePostParams = (id, userId) => {
    const [isLikeActive, setIsLikeActive] = useState(false)
    const [isCommentActive, setIsCommentActive] = useState(false)
    const [likesCount, setLikesCount] = useState(0)
    const [commentsCount, setCommentsCount] = useState(0)

    useEffect(() => {
        fetchLikes(id).then(data => {
            setLikesCount(data.length)
            setIsLikeActive(data.map(d => d.user.id).includes(userId))
        })
        fetchComments(0, 0, id).then(data => {
            setCommentsCount(data.count)
        })
    }, [])

    const clickLike = () => {
        toggleLike(id).then(() => {
            setLikesCount(isLikeActive ? likesCount-1 : likesCount+1)
            setIsLikeActive(!isLikeActive)
        }).catch((e) => console.log(e.response.data.message))
    }
    const clickComment = () => {
        setIsCommentActive(!isCommentActive)
    }

    const increaseCommentCount = () => {
        setCommentsCount(commentsCount+1)
    }
    const decreaseCommentCount = () => {
        setCommentsCount(commentsCount-1)
    }

    return [isLikeActive, isCommentActive, likesCount, commentsCount,
        clickLike, clickComment, increaseCommentCount, decreaseCommentCount]
}