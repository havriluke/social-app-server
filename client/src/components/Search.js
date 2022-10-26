import React, { useEffect, useMemo, useRef, useState } from 'react'
import searchLogo from '../assets/logos/search-line.svg'
import closeLogo from '../assets/logos/close-line.svg'
import '../styles/search.css'

const Search = ({active, activeFunc, value, setValueFunc}) => {
    const searchInputElem = useRef()

    useEffect(() => {
        if (!active) return
        searchInputElem.current.focus()
        setValueFunc('')
    }, [active])

    return (
        <div className='search'>
            {active && <input ref={searchInputElem}
                className='search__input'
                placeholder='Пошук'
                value={value}
                onChange={(e) => {setValueFunc(e.target.value)}}></input>}
            <button className='search__button clickable' onClick={activeFunc}>
                <img className='search__logo' src={active ? closeLogo : searchLogo} />
            </button>
            
        </div>
    )
}

export default Search