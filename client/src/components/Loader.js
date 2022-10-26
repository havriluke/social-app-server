import React from 'react'
import '../styles/loader.css'

const Loader = ({classes, styles}) => {
    return (
        <div className={`loader ${classes}`} style={styles}>
            <div className='loader__item loader__item_1'></div>
            <div className='loader__item loader__item_2'></div>
            <div className='loader__item loader__item_3'></div>
        </div>
    )
}

export default Loader