import React from 'react'
import plane from '../assets/logos/send-plane-fill.svg'
import pencilWhite from '../assets/logos/pencil-fill-white.svg'

const MessageInput = ({className, onChange, onClick, value, placeholder, edit}) => {

    const handleKeypress = e => {
        if (e.charCode === 13) {
            onClick();
        }
    }

    return (
        <div className={`message-input ${className}`}>
          <input
            className='message-input__input'
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            autoFocus
            onKeyPress={handleKeypress}
          />
          <button
            className={`message-input__button message__button clickable ${edit ? 'pencil': ''}`}
            onClick={onClick}>
              <img src={edit ? pencilWhite : plane}/>
          </button>
        </div>
    )
}

export default MessageInput