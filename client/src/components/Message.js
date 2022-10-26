import React, { useEffect, useState } from 'react'
import '../styles/message.css'
import dots from '../assets/logos/more-fill.svg'
import pencilBlack from '../assets/logos/pencil-fill-black.svg'
import checkLine from '../assets/logos/check-line.svg'
import checkLineDouble from '../assets/logos/check-double-line.svg'
import DropDownList from './DropDownList'
import Avatar from './Avatar'

const Message = ({item, userId, editFunc, deleteFunc, companion, chatElem}) => {

    const dropDownItems = [
        {title: 'Копіювати', classes: '', onclick: () => {navigator.clipboard.writeText(item.text)}},
        {title: 'Редагувати', classes: '', onclick: () => { editFunc(item.id, item.text) }},
        {title: 'Видалити', classes: 'red', onclick: () => { deleteFunc(item.id) }}
    ]

    const getDate = (dateNumber) => {
        const date = new Date(dateNumber)
        return `${date.getDate()}.${date.getMonth()+1}`
    }

    const getTime = (dateNumber) => {
        const date = new Date(dateNumber)
        return `${date.getHours()}:${date.getMinutes()}`
    }

    return (
        <div className={`message__wrapper ${item.userId === userId ? 'u' : 'c'} ${item.first ? 'first' : ''} ${item.newDay ? 'nd' : ''}`}>
            {item.newDay && <div className='message__new-day'>{getDate(item.datetime)}</div>}
            <DropDownList
                className={'message__dropdown-list'}
                image={dots}
                items={item.userId === userId ? dropDownItems : [dropDownItems[0]]}
                listPosition={item.userId === userId ? {bottom: '20px', right: '-20px'} : {bottom: '20px', left: '-30px'}}
                scrollBgElem={chatElem}
            />
            <div className={`message`}>
                <div className='message__text'>
                    {item.text}
                </div>
                <div className='message__time'>{getTime(item.datetime)}</div>
                {item.edited && <div className='message__edit-icon'><img src={pencilBlack} /></div>}
                {item.userId === userId && <div className='message__read-icon'><img src={item.read ? checkLineDouble : checkLine} /></div>}
            </div>
            {item.userId !== userId && item.first && <Avatar image={companion.photo} size={35} />}
        </div>
    )
}

export default Message