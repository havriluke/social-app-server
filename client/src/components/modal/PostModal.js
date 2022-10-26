import React, { useContext, useEffect, useState } from 'react'
import Modal from './Modal'
import '../../styles/modal.css'
import Select from '../UI/Select'
import { Context } from '../..'
import { observer } from 'mobx-react-lite'
import Avatar from '../Avatar'

const PostModal = observer(({isModalActive, closeModalActive, create, edit, params}) => {
    const items = [
        {title: 'public', value: false},
        {title: 'private', value: true}
    ]
    const {user} = useContext(Context)
    const [isPrivate, setIsPrivate] = useState(params.private)
    const [text, setText] = useState(params.text)
    const [photo, setPhoto] = useState(null)

    useEffect(() => {
        if (photo === null || photo.type.split('/')[0] === 'image') return
        setPhoto(null)
      }, [photo])

    const handleClick = () => {
        const formData = new FormData()
        formData.append('text', text)
        formData.append('isPrivate', isPrivate)
        if (!params.id) {
            formData.append('photo', photo)
            create(formData)
        } else {
            formData.append('id', params.id)
            edit(formData)
        }
        closeModalActive()
    }

    return (
        <Modal title={'Напишіть пост'} isActive={isModalActive} closeModal={closeModalActive}>
            <div className='create-post__top'>
                <div className='create-post__acc-info'>
                    <Avatar image={user.user.photo} size={60} />
                    <div className='create-post__acc-names'>
                        <div className='create-post__nickname'>{user.user.nickname}</div>
                        <Select
                            classes={'create-post__select'}
                            items={items} defaultOption={params.private ? items[1] : items[0]}
                            setValue={setIsPrivate}
                        />
                    </div>
                </div>
                <div
                    className={`create-post__words-count ${text.length > 500 ? 'red' : ''}`}
                    >
                    {`${text.length}/500`}
                </div>
            </div>
            
            <textarea
                className='create-post__text'
                value={text}
                onChange={(e) => {setText(e.target.value)}}
                placeholder='Що трапилось?'
            />
            <div className='create-post__buttons'>
                {!params.id && <div className='modal__files'>  
                    <input onChange={(e) => {setPhoto(e.target.files[0])}} className='modal__photo' type={'file'} accept={'image/*'} />
                    <div className='modal__fake-photo'><button className='create-post__photo-button'>Фото</button></div>
                </div>}
                <button className='green clickable' onClick={handleClick}>Опублікувати</button>
            </div>
        </Modal>
    )
})

export default PostModal