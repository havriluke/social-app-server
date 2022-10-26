import '../styles/checkLine.css'

const CheckLine = ({items, type}) => {

    const handleClick = (index) => {
        if (index === type) return
        window.scrollTo(0, 0)
        items[index].onclick()
    }

    return (
        <div className='check-line check-line__list'>
            {items.map((item, index) => {
                return <div
                    key={index}
                    className={`check-line__item ${index === type ? 'active' : ''}`}
                    onClick={() => {handleClick(index)}}
                >
                    {item.title}
                </div>
            })}
            
        </div>
    )
}

export default CheckLine