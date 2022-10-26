import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { confirmPassword, editUser } from '../../http/userAPI'
import { MAIN_ROUTE } from '../../utils/const'
import Modal from './Modal'

const AccountModal = ({isActive, closeFunc}) => {
  const navigate = useNavigate()
  const [isConfirmed, setIsConfirmed] = useState(false)
  const [error, setError] = useState('')
  const [password, setPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [newNickname, setNewNickname] = useState('')
  const [newPhoto, setNewPhoto] = useState(null)

  useEffect(() => {
    if (newPhoto === null || newPhoto.type.split('/')[0] === 'image') return
    setNewPhoto(null)
  }, [newPhoto])

  const confirmFunc = () => {
    confirmPassword(password).then(() => {
      setIsConfirmed(true)
    }).catch(error => {
      setError(error.response.data.message)
      setPassword('')
    })
  }

  const submitEdit = () => {
    const formData = new FormData()
    formData.append('nickname', newNickname)
    formData.append('password', newPassword)
    formData.append('photo', newPhoto)
    editUser(formData).then(data => {
      navigate(MAIN_ROUTE)
      navigate(0)
    }).catch(error => {
      console.log(error.response.data.message)
    })
  }

  return (
    <Modal title={'Акаунт'} isActive={isActive} closeModal={closeFunc}>
      {!isConfirmed && <div className='account-modal__confirm'>
        <input value={password} onChange={(e) => {setPassword(e.target.value)}} type={'password'} placeholder={'Введіть пароль'} />
        <button className='green clickable' onClick={confirmFunc}>Підтвердити</button>
        <div className='account-modal__text'>{!error ? 'Для внесення змін введіть пароль' : error}</div>
      </div>}

      {isConfirmed && <div className='account-modal__settings'>
        <div className='account-modal__setting'>
          <div className='account-modal__label'>Введіть новий нікнейм</div>
          <input value={newNickname} onChange={(e) => {setNewNickname(e.target.value)}} placeholder={'Новий нікнейм'} />
        </div>
        <div className='account-modal__setting'>
          <div className='account-modal__label'>Введіть новий пароль</div>
          <input value={newPassword} onChange={(e) => {setNewPassword(e.target.value)}} type={'password'} placeholder={'Новий пароль'} />
        </div>
        <div className='account-modal__setting photo'>
          <div className='account-modal__label'>Виберіть нове фото</div>
          <div className='modal__files'>
            <input onChange={(e) => {setNewPhoto(e.target.files[0])}} className='modal__photo' type={'file'} accept={'image/*'}/>
            <div className='modal__fake-photo'><button className=''>Нове фото</button></div>
          </div>
        </div>
        <div className='account-modal__buttons'>
          <button className='green clickable' onClick={submitEdit}>Підтвердити</button>
        </div>
      </div>}

      
    </Modal>
  )
}

export default AccountModal