import { observer } from 'mobx-react-lite'
import React, { useContext, useEffect, useState } from 'react'
import { Context } from '../index'
import DropDownList from './DropDownList'
import '../styles/navbar.css'
import details from '../assets/logos/more-fill.svg'
import homePassive from '../assets/logos/passive/home-2-line.svg'
import friendsPassive from '../assets/logos/passive/account-pin-circle-line.svg'
import chatsPassive from '../assets/logos/passive/chat-1-line.svg'
import homeActive from '../assets/logos/active/home-2-line.svg'
import friendsActive from '../assets/logos/active/account-pin-circle-line.svg'
import chatsActive from '../assets/logos/active/chat-1-line.svg'
import { fetchUnreadMessages, readMessages } from '../http/messagesAPI'
import { useLocation, useNavigate } from 'react-router-dom'
import { ADMIN_ROUTE, CHATS_ROUTE, CHAT_ROUTE, FRIENDS_ROUTE, MAIN_ROUTE, PAGE_ROUTE,  } from '../utils/const'
import AccountModal from './modal/AccountModal'
import { fetchRequests } from '../http/friendsAPI'

const NavBar = observer(() => {
    const {user, socket} = useContext(Context)
    const navigate = useNavigate()
    const location = useLocation().pathname
    const [prevLocation, setPrevLocation] = useState('')
    const [activeCell, setActiveCell] = useState({})
    const [isActiveAccount, setIsActiveAccount] = useState(false)
    const [messageCount, setMessageCount] = useState(0)
    const [friendCount, setFriendCount] = useState(0)

    const detailsItems = [
        { title: user.user.nickname, onclick: () => {}, classes: 'title' },
        { title: 'Моя сторінка', onclick: ()=>{
            navigate(`${PAGE_ROUTE}/${user.user.nickname}`)
        }, classes: '' },
        { title: 'Акаунт', onclick: () => {setIsActiveAccount(true)}, classes: '' },
        { title: 'Вийти', onclick: () => { logOut() }, classes: 'red' }
    ]

    const navBarRoutes = {
        home: [MAIN_ROUTE],
        chats: [CHATS_ROUTE, CHAT_ROUTE],
        friends: [PAGE_ROUTE, FRIENDS_ROUTE],
        admin: [ADMIN_ROUTE]
    }

    const logOut = () => {
        localStorage.removeItem('token')
        navigate(0)
    }

    socket.on('set-ban', logOut)
    socket.on('notification-message', () => {
        setMessageCount(messageCount+1)
    })
    socket.on('send-request', () => {
        setFriendCount(friendCount+1)
    })
    socket.on('cancel-request', () => {
        setFriendCount(friendCount-1)
    })
    
    useEffect(() => {
        if (!user.user.id) return
        socket.emit('join-room', `n${user.user.id}`)
    }, [user.user.id])

    useEffect(() => {
        fetchUnreadMessages().then((data) => {
            setMessageCount(data)
        })
        fetchRequests(1, 1).then((data) => {
            setFriendCount(data.count)
        })
    }, [])

    useEffect(() => {
        const locationPath = '/' + location.split('/')[1]
        setActiveCell({
            home: navBarRoutes['home'].includes(locationPath),
            chats: navBarRoutes['chats'].includes(locationPath),
            friends: navBarRoutes['friends'].includes(locationPath),
            admin: navBarRoutes['admin'].includes(locationPath)
        })
        if (prevLocation.split('/')[1] === 'chat') {
            socket.emit('leave-room', prevLocation.split('/')[2])
        }
        if (location.split('/')[1] === 'chat' || location.split('/')[1] === 'chats') {
            readMessages(location.split('/')[2]).catch((e) => {
                console.log(e.response.data.message);
            }).finally(() => {
                fetchUnreadMessages().then((data) => {
                    setMessageCount(data)
                })
            })
        }
        if (location.split('/')[1] !== 'friends') {
            fetchRequests(1, 1).then((data) => {
                setFriendCount(data.count)
            })
        }
        setPrevLocation(location)
    }, [location])

    return (
        <div className='navbar'>

            {isActiveAccount && <AccountModal isActive={isActiveAccount} closeFunc={() => setIsActiveAccount(false)} />}
            
            <div className='navbar-top'>
                <div className='navbar-top__container container'>
                    <div className='navbar-top__logo'>Shmara</div>
                    {user.isAuth && <DropDownList
                        className='navbar-top__details'
                        image={details}
                        items={detailsItems}
                        listPosition={{right: 0, top: '150%'}}
                        scrollBgElem={window}
                    />}
                </div>
            </div>

            {user.isAuth &&
            <div className='navbar-bottom container' >
                <div className='navbar-bottom__list navbar-list' >
                    <div
                        className={`navbar-list__item ${activeCell['home'] ? 'active' : ''}`}
                        onClick={() => navigate(MAIN_ROUTE)}
                    >
                        <img src={activeCell['home'] ? homeActive : homePassive} />
                    </div>
                    <div
                        className={`navbar-list__item ${activeCell['chats'] ? 'active' : ''}`}
                        onClick={() => navigate(CHATS_ROUTE)}
                    >
                        <img src={activeCell['chats'] ? chatsActive : chatsPassive} />
                        {!!messageCount && <div className='item__count'>{messageCount}</div>}
                    </div>
                    <div
                        className={`navbar-list__item ${activeCell['friends'] ? 'active' : ''}`}
                        onClick={() => navigate(FRIENDS_ROUTE)}
                    >
                        <img src={activeCell['friends'] ? friendsActive : friendsPassive} />
                        {!!friendCount && <div className='item__count'>{friendCount}</div>}
                    </div>
                    {user.user.role === 'ADMIN' && <div
                        className={`navbar-list__item admin ${activeCell['admin'] ? 'active' : ''}`}
                        onClick={() => navigate(ADMIN_ROUTE)}
                    >
                        {'ban'}
                    </div>}
                </div>
            </div>
            }
            

        </div>
    )
})

export default NavBar