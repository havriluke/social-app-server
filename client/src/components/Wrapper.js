import React from 'react'
import { useLocation } from 'react-router-dom'
import { Context } from '..'
import { fetchUnreadMessages, readMessages } from '../http/messagesAPI'

const Wrapper = (props) => {

  return (
    <div className='wrapper'>
        {props.children}
    </div>
  )
}

export default Wrapper