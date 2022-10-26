import React from 'react'

const CreatePost = ({createFunc}) => {

    return (
        <div className='component create-post'>
            <div className='create-post__title'>Що нового?</div>
            <button className='green clickable' onClick={createFunc}>Створити допис</button>
        </div>
  )
}

export default CreatePost