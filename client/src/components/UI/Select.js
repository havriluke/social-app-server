import React, {useState} from 'react'

const Select = ({classes, items, setValue, defaultOption}) => {
    const [option, setOption] = useState(defaultOption)
    const [isActive, setIsActive] = useState(false)

    const optionHandleClick = (item) => {
        setOption(item)
        setValue(item.value)
        setIsActive(false)
    }

    const handleClick = () => {
        setIsActive(!isActive)
    }

    return (
        <div className='select__wrapper'>
            <div className={`select ${classes}`} onClick={handleClick}>{option.title}</div>
            <div className={`select__options ${isActive ? 'active':''}`}>
                {items.map((item) => {
                    return <div
                        key={item.value}
                        className='select__option'
                        onClick={() => optionHandleClick(item)}
                    >
                        {item.title}
                    </div>
                })}
            </div>
        </div>
    )
}

export default Select