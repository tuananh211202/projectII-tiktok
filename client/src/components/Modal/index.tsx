import { Button, Divider, Form, Input, Modal, Row, notification } from 'antd';
import React, { useState, useEffect } from 'react';
import "./styles.css";
import { login, signup } from '../../API';

type NotificationType = 'success' | 'info' | 'warning' | 'error';

const UserModal = (props: any) => {
  const [api, contextHolder] = notification.useNotification();
  const openNotificationWithIcon = (notiType: NotificationType, title: string, message: string) => {
    api[notiType]({
        message: title,
        duration: 2,
        description: message
    });
  }

  const { modalOpen, setModalOpen } = props;
  const [type, setType] = useState("login");
  const [confirmPassword, setConfirmPassword] = useState('');
  const [form] = Form.useForm();
  
  useEffect(() => {
    form.resetFields();
    setConfirmPassword('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[type, modalOpen]);

  const handleClick = () => {
    const data = form.getFieldsValue();
    let errorList = [];
    
    // validate
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!data.username || data.username === '') errorList.push('Username is required!!!');
    else if(!emailRegex.test(data.username)) errorList.push('Username must be email!!!');
    if(!data.password || data.password === '') errorList.push('Password is required!!!');
    if(type === "signup"){
        if(data.password && data.password !== confirmPassword) errorList.push('Password is not match!!!');
        if(!data.name || data.name === '') errorList.push('You must enter name!!!');
        if(!data.description || data.description === '') errorList.push('You must fill description!!!');
    }
    ////
    if(errorList.length > 0){
        errorList.map(msg => openNotificationWithIcon('error', "Error", msg));
    }
    else {
        type === "login" ? login(data, openNotificationWithIcon, setModalOpen) : signup(data, openNotificationWithIcon, setType);
    }
  }

  const handleCancel = () => {
    setModalOpen(false);
    setType("login");
  }

  return (
    <>
        {contextHolder}
        <Modal 
            title={type === "login" ? "Log in to TikGer" : "Sign up to TikGer"}
            open={modalOpen} 
            footer={null} 
            centered={true}
            width={500}
            className="modalStyle"
            onCancel={handleCancel}
        >
            <Form className="px-10 py-5" form={form} style={{ height: "400px" }}>
                <Form.Item name="username">
                    <Input placeholder="Email" name="username" style={{ fontFamily: "Signika" }} className="p-2" />
                </Form.Item>
                <Form.Item name="password">
                    <Input placeholder="Password" name="password" type='password' style={{ fontFamily: "Signika" }} className="p-2" />
                </Form.Item>
                { type === "login" ? null :
                    <>
                        <Input placeholder="Confirm password" type='password' style={{ fontFamily: "Signika" }} className="p-2 mb-6" 
                            value={confirmPassword} 
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <Form.Item name="name">
                            <Input placeholder="Name" style={{ fontFamily: "Signika" }} className="p-2" />
                        </Form.Item>
                        <Form.Item name="description">
                            <Input.TextArea 
                                placeholder="Description" 
                                style={{ fontFamily: "Signika" }}
                                className="p-2" 
                                showCount={true}
                                rows={2}
                                maxLength={80}
                            />
                        </Form.Item>
                    </>
                }
                <Button 
                    className="w-full border-none text-white h-10" 
                    style={{ fontFamily: "Signika", fontWeight: 500, backgroundColor: "#FE2C55" }}
                    onClick={handleClick}
                >
                    {type === "login" ? "Log in" : "Sign up"}
                </Button>
            </Form>
            <Divider className='w-full' />
            <Row className="w-full flex justify-center pb-1 items-center">
                <Row style={{ fontFamily: "Signika", fontWeight: 500}}>
                    {type === "login" ? "Dont have an account?" : "Already have an account?"}
                </Row>
                &nbsp;
                <Button 
                    type='link'
                    className='m-0 p-0 border-none' 
                    style={{ fontFamily: "Signika", fontWeight: 500, color: "#FE2C55"}}
                    onClick={() => setType(type === "signup" ? "login" : "signup")}
                >
                    {type === "login" ? "Signup" : "Login"}
                </Button>
            </Row>
        </Modal>
    </>
  );
}

export default UserModal;