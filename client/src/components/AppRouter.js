import { observer } from 'mobx-react-lite'
import React, { useContext, useEffect, useState } from 'react'
import {Routes, Route, Navigate} from 'react-router-dom'
import { Context } from '..'
import { adminRoutes, authRoutes, unAuthRoutes } from '../routes'
import { LOGIN_ROUTE, MAIN_ROUTE } from '../utils/const'
import Main from '../pages/Main'

const AppRouter = observer(() => {
    const {user} = useContext(Context)

    return (
        <Routes>
            {user.isAdmin() && adminRoutes.map(({path, Component}) => {
                return <Route key={path} path={path} element={Component}  />
            })}
            {user.isAuth ?
                authRoutes.map(({path, Component}) => {
                    return <Route key={path} path={path} element={Component} />
                })
                :
                unAuthRoutes.map(({path, Component}) => {
                    return <Route key={path} path={path} element={Component} />
                })
            }
            
            <Route path='*' element={<Navigate replace to={user.isAuth ? MAIN_ROUTE : LOGIN_ROUTE} />} />
        </Routes>
    )
})

export default AppRouter