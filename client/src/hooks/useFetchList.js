import { useState, useEffect } from "react"

export const useFetchList = (fetchFunc, defaultLimit, ...args) => {
    const [isLoading, setIsLoading] = useState(true)
    const [listsItems, setListsItems] = useState([])
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(defaultLimit)
    const [count, setCount] = useState(0)
    const [isEmpty, setIsEmpty] = useState(true)
    const [totalPages, setTotalPages] = useState(0)

    const getTotalPages = (count, limit) => {
        return Math.floor(count / limit) + 1
    }

    const getIsEmpty = (list) => {
        return list.length === 0
    }

    const initialValues = (list, count, limit) => {
        setIsEmpty(getIsEmpty(list))
        setTotalPages(getTotalPages(count, limit))
        setIsLoading(false)
    }

    const resetValues = () => {
        setIsEmpty(true)
        setIsLoading(true)
        setListsItems([])
        setTotalPages(0)
        setPage(1)
    }

    useEffect(() => {
        if (!args.every(arg => arg !== undefined)) {
            setIsLoading(false)
            return
        }
        resetValues()
        fetchFunc(limit, 1, ...args).then(data => {
            setListsItems([...data.rows])
            setCount(data.count)
            initialValues(data.rows, data.count, limit)
        })
    }, [fetchFunc, ...args])

    useEffect(() => {
        if (page === 1) return
        setIsLoading(true)
        fetchFunc(limit, page, ...args).then(data => {
            setListsItems([...listsItems, ...data.rows])
            initialValues([...listsItems, ...data.rows], data.count, limit)
        })
    }, [page])

    const increasePage = () => {
        setPage(page+1)
    }

    const putLimit = (limit) => {
        setLimit(limit)
    }

    return [increasePage, listsItems, isLoading, isEmpty, totalPages, page, putLimit]
}