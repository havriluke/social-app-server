import React, { useState } from 'react'
import '../styles/dropDown.css'

const DropDownList = ({image, className, items, listPosition, ref, scrollBgElem}) => {
    const [isActive, setIsActive] = useState(false)

    const handleClose = (e) => {
        const isList = e.target.classList.contains('drop-down__item')
        if (!isList) {
            document.removeEventListener('mousedown', handleClose, false)
            scrollBgElem.removeEventListener('scroll', scrollClose, false)
            setTimeout(() => {
                setIsActive(false)
            }, 100)
        }
    }
    const scrollClose = () => {
        setIsActive(false)
        scrollBgElem.removeEventListener('scroll', scrollClose, false)
        document.removeEventListener('mousedown', handleClose, false)
    }

    const handleClick = (e) => {
        if (!isActive) {
            console.log('log');
            setIsActive(true)
            document.addEventListener('mousedown', handleClose, false)
            scrollBgElem.addEventListener('scroll', scrollClose, false)
            return
        }
        if (!e.target.classList.contains('title')) {
            setIsActive(false)
            document.removeEventListener('mousedown', handleClose, false)
            scrollBgElem.removeEventListener('scroll', scrollClose, false)
        }
    }
    

    return (
        <div 
            ref={ref}
            className={`drop-down ${className} ${isActive ? 'active' : ''}`}
            onClick={handleClick}
        >
            <img className='drop-down__logo' src={image} />
            <div className='drop-down__list' style={listPosition}>
                {items.map((item, index) => {
                    return <div
                        key={index}
                        className={`drop-down__item ${item.classes}`}
                        onClick={() => { item.onclick() }}
                    >
                        {item.title}
                    </div>
                })}
            </div>
        </div>
    )
}

export default DropDownList