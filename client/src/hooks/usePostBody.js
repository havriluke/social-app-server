import { useEffect, useMemo, useState } from "react"

export const usePostBody = (text) => {
    const [bodyActive, setBodyActive] = useState(false)

    const bodyParags = useMemo(() => {
        if (bodyActive) {
            return text.split('\n')
        } else {
            return text.split('\n').slice(0, 2)
        }
    }, [bodyActive, text])

    useEffect(() => {
        if (text.split('\n').length <= 2) {
            setBodyActive(true)
        }
    }, [text])

    const bodyToggle = () => {
        if (text.split('\n').length <= 2) return
        setBodyActive(!bodyActive)
    }

    return [bodyParags, bodyActive, bodyToggle]
}