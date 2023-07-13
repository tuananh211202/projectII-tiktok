import { Button, Divider, Form, Input, Modal, Row, notification } from 'antd';
import React, { useState, useEffect, useContext } from 'react';
import "./styles.css";
import { getProfileById, login, signup, updatePassword, updateProfile } from '../../API';
import { AppContext } from '../../context/provider';
import { useNavigate } from 'react-router-dom';

type NotificationType = 'success' | 'info' | 'warning' | 'error';

const UserModal = () => {
  const [api, contextHolder] = notification.useNotification();
  const openNotificationWithIcon = (notiType: NotificationType, title: string, message: string) => {
    api[notiType]({
        message: title,
        duration: 2,
        description: message
    });
  }

  const { state, dispatch } = useContext(AppContext);
  const [type, setType] = useState("login");
  const [confirmPassword, setConfirmPassword] = useState('');
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    form.resetFields();
    if (type === "Edit profile") getProfileById(state.userId, form.setFieldsValue);
    setConfirmPassword('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[type, state.isModalOpen]);

  useEffect(() => {
      if (state.accessToken === '') setType("login");
      else setType("Edit profile");
  }, [state.accessToken]);

  const handleClick = () => {
    const data = form.getFieldsValue();
    let errorList = [];
    
    // validate
    if(type === "login"){
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!data.username || data.username === '') errorList.push('Username is required!!!');
        else if(!emailRegex.test(data.username)) errorList.push('Username must be email!!!');
        if(!data.password || data.password === '') errorList.push('Password is required!!!');
    }
    if(type === "signup"){
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!data.username || data.username === '') errorList.push('Username is required!!!');
        else if (!emailRegex.test(data.username)) errorList.push('Username must be email!!!');
        if (!data.password || data.password === '') errorList.push('Password is required!!!');
        if(data.password && data.password !== confirmPassword) errorList.push('Password is not match!!!');
        if(!data.name || data.name === '') errorList.push('You must enter name!!!');
        if(!data.description || data.description === '') errorList.push('You must fill description!!!');
    }
    if(type === "Edit profile"){
        if (!data.name || data.name === '') errorList.push('You must enter name!!!');
        if (!data.description || data.description === '') errorList.push('You must fill description!!!');
    }
    if(type === "Change password"){
        if (!data.old_password || data.old_password === '') errorList.push('Old password is required!!!');
        if (!data.password || data.password === '') errorList.push('Password is required!!!');
        if (data.password && data.password !== confirmPassword) errorList.push('Password is not match!!!');
    }
    ////
    if(errorList.length > 0){
        errorList.map(msg => openNotificationWithIcon('error', "Error", msg));
    }
    else {
        type === "login" ? login(data, openNotificationWithIcon, dispatch)
      : type === "signup" ? signup(data, openNotificationWithIcon, setType) 
                : type === "Edit profile" ? updateProfile(state.accessToken, state.userId, data, dispatch, openNotificationWithIcon)
                    : type === "Change password" ? updatePassword(state.accessToken, state.userId, data, dispatch, openNotificationWithIcon, navigate)
      : console.log("Alo");
    }
  }

  const handleCancel = () => {
    dispatch({ type: 'CLOSE_MODAL', payload: null });
    if (state.accessToken === '') setType("login");
    else setType("Edit profile");
  }

  return (
    <>
        {contextHolder}
        <Modal 
            title={
                type === "login" ? "Log in to TikGer" 
              : type === "signup" ? "Sign up to TikGer" 
              : type === "Edit profile" ? "Edit profile" 
              : type === "Change password" ? "Change password" 
              : ""
            }
            open={state.isModalOpen} 
            footer={null} 
            centered={true}
            width={500}
            className="modalStyle"
            onCancel={handleCancel}
        >
            <Form className="px-10 py-5" form={form} style={{ height: "400px" }}>
                {
                    type === "Change password" ? null :
                        <Form.Item name="username">
                              <Input placeholder="Email" name="username" style={{ fontFamily: "Signika" }} className="p-2" disabled={type === "Edit profile"} />
                        </Form.Item>
                }
                {
                    type === "Change password" ?
                        <Form.Item name="old_password">
                            <Input placeholder="Old password" name="old_password" type='password' style={{ fontFamily: "Signika" }} className="p-2" />
                        </Form.Item>
                    : null
                }
                {
                    type === "Edit profile" ? null :
                    <Form.Item name="password">
                        <Input placeholder="Password" name="password" type='password' style={{ fontFamily: "Signika" }} className="p-2" />
                    </Form.Item>
                    
                }  
                { type === "login" ? null :
                    <>
                        {
                            (type === "signup" || type === "Change password") ?
                                <Input placeholder="Confirm password" type='password' style={{ fontFamily: "Signika" }} className="p-2 mb-6" 
                                    value={confirmPassword} 
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            : null
                        }
                        {
                            (type === "signup" || type === "Edit profile") ? 
                                <>
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
                            : null
                        }
                    </>
                }
                <Button 
                    className="w-full border-none text-white h-10" 
                    style={{ fontFamily: "Signika", fontWeight: 500, backgroundColor: "#FE2C55" }}
                    onClick={handleClick}
                >
                    {
                        type === "login" ? "Log in" 
                      : type === "signup" ? "Sign up" 
                      : type === "Edit profile" ? "Save profile" 
                      : type === "Change password" ? "Save password" 
                      : ""
                    }
                </Button>
            </Form>
            <Divider className='w-full' />
            <Row className="w-full flex justify-center pb-1 items-center">
                <Row style={{ fontFamily: "Signika", fontWeight: 500}}>
                      {
                          type === "login" ? "Dont have an account?" 
                        : type === "signup" ? "Already have an account?" 
                        : type === "Change password" ? "Want to edit profile?"
                        : type === "Edit profile" ? "Want to change password?" 
                        : ""
                      } 
                </Row>
                &nbsp;
                <Button 
                    type='link'
                    className='m-0 p-0 border-none' 
                    style={{ fontFamily: "Signika", fontWeight: 500, color: "#FE2C55"}}
                    onClick={() => setType(
                        type === "signup" ? "login" 
                      : type === "login" ? "signup"
                      : type === "Edit profile" ? "Change password"
                      : type === "Change password" ? "Edit profile"
                      : ""
                    )}
                >
                    {
                        type === "login" ? "Signup" 
                      : type === "signup" ? "Login" 
                      : type === "Change password" ? "Edit profile" 
                      : type === "Edit profile" ? "Change password" 
                      : ""
                    }
                </Button>
            </Row>
        </Modal>
    </>
  );
}

export default UserModal;