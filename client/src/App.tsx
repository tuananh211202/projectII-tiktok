import { Row } from 'antd';
import React, { useEffect, useState } from 'react';
import Header from './components/Header';
import SideBar from './components/SideBar';
import UserModal from './components/Modal';
import Chat from './components/Chat';
import Main from './components/Main';

const App = () => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <Row className="w-full">
      <Header modalOpen={modalOpen} setModalOpen={setModalOpen} />
      <SideBar />
      <UserModal modalOpen={modalOpen} setModalOpen={setModalOpen} />
      <Main />
      <Chat />
    </Row>
  );
}

export default App;