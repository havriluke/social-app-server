import React, { useEffect, useState } from 'react'
import '../styles/scrollUpButton.css'

const ScrollUpButton = () => {
    const [isActive, setIsActive] = useState(false)

    const handleClick = () => {
        window.scrollTo({top: 0, left: 0, behavior: 'smooth'})
    }

    const handleScroll = () => {
        const scrollPosition = window.scrollY
        const windowHeight = window.innerHeight
        if (scrollPosition >= windowHeight / 2) {
            setIsActive(true)
        } else {
            setIsActive(false)
        }
    }

    useEffect(() => {
        document.addEventListener('scroll', handleScroll)
    }, [])

    return (
        <div onClick={() => {handleClick()}} className={`scroll-up-button ${isActive ? 'active' : ''}`}></div>
    )
}

export default ScrollUpButton