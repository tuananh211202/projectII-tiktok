import { Button, Col, FloatButton, Input, List, Row } from 'antd';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { MdAddComment } from "react-icons/md";
import { AiOutlineMinus, AiOutlineSend } from 'react-icons/ai';
import Cookies from 'js-cookie';
import { io } from 'socket.io-client';
import { getMessage, getProfileById } from '../../API';
import { AppContext } from '../../context/provider';
import HideOnClickOutside from '../HideOnClickOutside';

export const socket = io('http://localhost:3001');

const Chat = () => {
    const { state, dispatch } = useContext(AppContext);
    const [onChat, setOnChat] = useState({id: 0, username: '', name: '', description: ''});
    const chatBoxRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        getProfileById(state.onChat, setOnChat);
    },[state.onChat]);

    useEffect(() => {
        if(state.onChat !== 0 && state.userId !== 0) getMessage(state.accessToken, state.userId, state.onChat).then(res => setMessages(res.data));
    }, [state.onChat, state.userId, state.accessToken]);

    const [messages, setMessages] = useState<any[]>([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        socket.on('recMessage', (msg) => {
            if(msg.senderId === state.userId || msg.receiverId === state.userId)
                getMessage(state.accessToken, msg.senderId, msg.receiverId).then(res => setMessages(res.data));
        });
    // eslint-disable-next-line
    }, [messages]);

    useEffect(() => {
        const chatBox = chatBoxRef.current;
        if (chatBox) chatBox.scrollTop = chatBox.scrollHeight - chatBox.offsetHeight;
    },[messages, state.isOnChat]);

    const handleChat = () => {
        if(message !== '' && state.onChat !== 0){
            socket.emit('sendMessage', {description: message, senderId: state.userId, receiverId: state.onChat});
            setMessage('');
        }
    }

    const onHide = () => {
        dispatch({ type: "CLOSE_CHAT", payload: null });
    }

    return (
        state.accessToken === '' ? null :
        !state.isOnChat
        ?
        <FloatButton 
            icon={<MdAddComment />} 
            type='primary' 
            style={{ right: 20, bottom: 20 }} 
            onClick={() => {dispatch({ type: 'OPEN_CHAT', payload: { onChat: state.onChat } });Cookies.set('on_chat', ''+ state.onChat)}}
        />
        :
        <HideOnClickOutside onHide={onHide}>
            <Row 
                className='border-solid border-2 w-1/6 h-96 rounded-t-xl border-t-0 z-10' 
                        style={{ position: 'fixed', right: 20, bottom: 0, borderColor: "#1677ff", backgroundColor: "#e2e9f1" }}
            >
                <Row 
                    className='w-full h-10 p-2 border-solid border-b-2 flex items-center justify-between rounded-t-xl'
                    style={{ backgroundColor: "#1677ff" }}
                >
                    <Col className='text-white'>{onChat.name}</Col>
                    <Col>
                        <Button type='link' onClick={() => dispatch({ type: 'CLOSE_CHAT', payload: { onChat: 0 } })}
                            className='m-0 p-0 border-none flex items-center h-3 w-3'
                        >
                            <AiOutlineMinus color='white' />
                        </Button>
                    </Col>
                </Row>
                <Row className='w-full px-1 pb-2'>
                    <Row className='w-full' ref={chatBoxRef}
                        style={{ height: "285px", overflowY: "auto", scrollBehavior: "smooth"}}
                    >
                        <List
                            size="small"
                            bordered
                            split={false}
                            dataSource={messages}
                            renderItem={(item) => (
                                <List.Item className='w-full border-none'>
                                    <Row className={'w-full flex ' + (parseInt(item.sender) === state.userId ? 'justify-end' : '')}>
                                        <Row className={'w-fit border-solid border-2 border-black px-1 rounded-lg flex ' + (parseInt(item.sender) === state.userId ? 'justify-end' : '')}
                                            style={{ fontFamily: "Signika", backgroundColor: parseInt(item.receiver) === state.userId ?  "white" : "#d5f1ff", borderColor: "#d1dfe8" }}
                                        >
                                            <p className='w-fit break-words' style={{ maxWidth: "160px" }}>{item.description}</p>
                                        </Row>
                                    </Row>
                                </List.Item>
                            )}
                            className='w-full border-none rounded-none'
                        />
                    </Row>
                    <Row className='w-full flex items-center justify-between' style={{ height: "40px" }}>
                        <Input 
                            className='w-5/6 rounded-full' 
                            value={message}
                            placeholder='Enter' onChange={(e) => setMessage(e.target.value)} 
                            style={{ fontFamily: "Signika" }} 
                            onPressEnter={handleChat}
                        />
                        <Button type='link' onClick={handleChat}
                            className='m-0 p-0 border-none flex items-center'
                        >
                            <AiOutlineSend size={25} />
                        </Button>
                    </Row>
                </Row>
            </Row>
        </HideOnClickOutside>
    );
}

export default Chat;