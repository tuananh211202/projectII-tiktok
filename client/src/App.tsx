import { Row } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import Header from './components/Header';
import SideBar from './components/SideBar';
import UserModal from './components/Modal';
import Chat from './components/Chat';
import Main from './components/Main';
import { AppContext, AppProvider } from './context/provider';
import Cookies from 'js-cookie';

const App = () => {
  return (
    <AppProvider>
      <Row className="w-full">
        <Header />
        <SideBar />
        <UserModal/>
        <Main />
        <Chat />
      </Row>
    </AppProvider>
  );
}

export default App;