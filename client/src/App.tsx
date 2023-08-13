import { Row } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import Header from './components/Header';
import SideBar from './components/SideBar';
import UserModal from './components/Modal';
import Chat from './components/Chat';
import Main from './components/Main';
import { AppContext, AppProvider } from './context/provider';
import Cookies from 'js-cookie';
import NotiDropdown from './components/NotiDropdown';
import { Route, Routes } from 'react-router-dom';
import DetailsPost from './components/DetailsPost';

const App = () => {
  return (
    <AppProvider>
      <Row className="w-full">
        <Header />
        <UserModal/>
        <Chat />
        <NotiDropdown />
        <SideBar />
        <Main />
      </Row>
    </AppProvider>
  );
}

export default App;