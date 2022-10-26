import React, { useRef, useState } from 'react'

const Modal = ({children, title, isActive, closeModal}) => {
    const modalElem = useRef()
    const closeElem = useRef()

    const click = (e) => {
        if (e.target === modalElem.current || e.target === closeElem.current) {
            closeModal()
        }
    }

    return (
        <>
            {isActive && <div ref={modalElem} className={`modal ${isActive ? 'active' : ''}`} onClick={click}>
                <div className='modal__body component'>
                    <div className='modal__top'>
                        <div className='modal__title'>{title}</div>
                        <div ref={closeElem} className='modal__close'></div>
                    </div>
                    {children}
                </div>
            </div>}
        </>
    )
}

export default Modal