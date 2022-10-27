import React, { useContext, useEffect, useMemo, useState } from 'react'
import DropDownList from './DropDownList'
import dots from '../assets/logos/more-fill-black.svg'
import heart from '../assets/logos/passive/heart-3-line.svg'
import heartActive from '../assets/logos/active/heart-3-fill.svg'
import comment from '../assets/logos/passive/message-3-line.svg'
import commentActive from '../assets/logos/active/message-3-fill.svg'
import spy from '../assets/logos/spy-fill.svg'
import pencil from '../assets/logos/pencil-fill.svg'
import '../styles/post.css'
import { useNavigate } from 'react-router-dom'
import { PAGE_ROUTE, REACT_APP_API_URL } from '../utils/const'
import { observer } from 'mobx-react-lite'
import { Context } from '..'
import Comments from './Comments'
import { usePostParams } from '../hooks/usePostParams'
import { usePostBody } from '../hooks/usePostBody'
import Avatar from './Avatar'

const Post = observer(({item, deleteFunc, editFunc}) => {
    const {user} = useContext(Context)
    const navigate = useNavigate()

    const [bodyParags, bodyActive, bodyToggle] = usePostBody(item.text)
    const [isLikeActive, isCommentActive, likesCount, commentsCount, clickLike, clickComment,
        increaseCommentCount, decreaseCommentCount] = usePostParams(item.id, user.user.id)


    const dropDownItems = [
        {title: 'Ваш пост', classes: 'title'},
        {title: 'Редагувати', classes: '', onclick: () => {editFunc(item.id, item.text, item.private)}},
        {title: 'Видалити', classes: 'red', onclick: () => {deleteFunc(item.id)}}
    ]

    const getDate = (dateNumber) => {
        const date = new Date(dateNumber)
        return `${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`
    }

    return (
        <div className={`post component`}>
            
            <div className='post__info'>
                <div className='post-info__account' onClick={() => {navigate(`${PAGE_ROUTE}/${item.user.nickname}`)}}>
                    <Avatar image={item.user.photo} size={60} />
                    <div className='post-info__titles'>
                        <div className='post-info__name'>{item.user.nickname}</div>
                        <div className='post-info__date'>{getDate(item.datetime)}</div>
                    </div>
                </div>
                {(item.user.id === user.user.id || user.user.role === 'ADMIN') &&
                    <DropDownList
                        listPosition={{top: 0, right: 40}}
                        items={item.user.id !== user.user.id && user.user.role === 'ADMIN' ? [dropDownItems[2]] : dropDownItems}
                        image={dots}
                        className={'post-info__drop-down'}
                        scrollBgElem={window}
                    />
                }
            </div>

            <div className='post__body'>
                <div className='post__parags' onClick={bodyToggle}>
                    {bodyParags.map((parag, index) => {
                        return <div key={index} className='post__parag'>{parag}</div>
                    })}
                    {!bodyActive && 
                        <div className='post__more'><div></div><div></div><div></div></div>
                    }
                </div>
                {item.photo && <div className='post__photo' onDoubleClick={clickLike} >
                    <img src={REACT_APP_API_URL+item.photo} />
                </div>}
            </div>

            <div className='post__icons'>
                <div className={`post-icons__like post__icon ${isLikeActive ? 'active' : ''}`} onClick={clickLike}>
                    <img src={isLikeActive ? heartActive : heart} />
                    <div >{likesCount}</div>
                </div>
                <div className={`post-icons__comment post__icon ${isCommentActive ? 'active' : ''}`} onClick={clickComment}>
                    <img src={isCommentActive ? commentActive : comment} />
                    <div >{commentsCount}</div>
                </div>
                <div className='post-icons__indicators'>
                    {item.edit && <img src={pencil} />}
                    {item.private && <img src={spy} />}
                </div>
            </div>

            {isCommentActive &&
                <Comments
                    postId={item.id}
                    increaseCount={increaseCommentCount}
                    decreaseCount={decreaseCommentCount}
                />
            }

        </div>
    )
})

export default Post