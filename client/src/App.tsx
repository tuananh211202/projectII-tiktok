import { Col, Row } from 'antd';
import React, { useState } from 'react';
import Header from './components/Header';
import SideBar from './components/SideBar';
import UserModal from './components/Modal';

const App = () => {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <Row className="w-full">
      <Header modalOpen={modalOpen} setModalOpen={setModalOpen} />
      <Col span={3}>
        <SideBar />
      </Col>
      <UserModal modalOpen={modalOpen} setModalOpen={setModalOpen} />
    </Row>
  );
}

export default App;