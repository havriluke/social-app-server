import React, { useContext, useEffect, useState } from 'react'
import {BrowserRouter, useLocation} from 'react-router-dom'
import { Context } from './index'
import './App.css'
import AppRouter from './components/AppRouter'
import { check } from './http/userAPI'
import {observer} from 'mobx-react-lite'
import NavBar from './components/NavBar'
import Wrapper from './components/Wrapper'
import Loader from './components/Loader'

const App = observer(() => {
  const {user} = useContext(Context)
  const [loading, isLoading] = useState(true)

  useEffect(() => {
    check().then((data) => {
      user.setUser(data)
      user.setIsAuth(true)
    }).catch((e) => {
      console.log(e.response.data.message);
    }).finally(() => {
      isLoading(false)
    })
  }, [])

  if (loading) {
    return <Loader />
  }
   
  return (
    <BrowserRouter>
      <NavBar />
      <Wrapper >
        <AppRouter />
      </Wrapper>
    </BrowserRouter>
  )
})

export default App;
