import React, { useEffect, useRef } from 'react'
import Empty from './Empty'
import Loader from './Loader'
import ScrollUpButton from './ScrollUpButton'

const ListWrapper = ({classes, isEmpty, children, page, totalPages, limitFunc, isLoading, ref}) => {
    const lastElement = useRef()
    const observer = useRef()

    useEffect(() => {
        if (page === undefined) return
        if (observer.current) observer.current.disconnect()
        const callback = function(entries, observer) {
            if (entries[0].isIntersecting && page < totalPages) {
                limitFunc()
            }
        }
        observer.current = new IntersectionObserver(callback)
        observer.current.observe(lastElement.current)
    }, [page, totalPages])

    return (
        <>
            {<div className={`${classes}`} ref={ref}>
                <ScrollUpButton />
                {isEmpty && !isLoading && <Empty />}
                {children}
                {isLoading && <Loader classes={'list-loader'}/>}
                {<div
                    ref={lastElement}
                    className='list-limit-block'
                    style={{height: 0}}
                ></div>}
            </div>}
        </>
    )
}

export default ListWrapper