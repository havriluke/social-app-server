import React, {createContext} from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import UserStore from './store/UserStore'
import {io} from 'socket.io-client'
import { REACT_APP_API_URL } from './utils/const';

export const Context = createContext(null)

const socket = io(REACT_APP_API_URL)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Context.Provider value={{
    user: new UserStore(),
    socket,
  }}>
    <App />
  </Context.Provider>
);

