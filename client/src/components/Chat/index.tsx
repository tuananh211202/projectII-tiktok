import { Button, Col, FloatButton, Input, List, Row } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { MdAddComment } from "react-icons/md";
import { AiOutlineMinus, AiOutlineSend } from 'react-icons/ai';
import Cookies from 'js-cookie';
import { io } from 'socket.io-client';
import { getMessage, getProfile } from '../../API';

const socket = io('http://localhost:3001');

const Chat = () => {
    const [onChat, setOnChat] = useState(false);
    const accessToken = Cookies.get('access_token') ?? '';
    const [user, setUser] = useState({ id: 0, name: '', email: '', description: '' });
    const chatBoxRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (accessToken !== '') getProfile(accessToken).then(res => setUser(res.data));
        getMessage(accessToken, 1, 5).then(res => setMessages(res.data));
    // eslint-disable-next-line
    }, []);

    const [messages, setMessages] = useState<any[]>([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        socket.on('recMessage', (msg) => {
            getMessage(accessToken, msg.senderId, msg.receiverId).then(res => setMessages(res.data));
        });
    // eslint-disable-next-line
    }, [messages]);

    useEffect(() => {
        const chatBox = chatBoxRef.current;
        if (chatBox) chatBox.scrollTop = chatBox.scrollHeight - chatBox.offsetHeight;
        console.log(messages);
    },[messages, onChat]);

    const handleChat = () => {
        if(message !== ''){
            socket.emit('sendMessage', {description: message, senderId: 1, receiverId: 5});
            setMessage('');
        }
    }

    return (
        accessToken === '' ? null :
        !onChat
        ?
        <FloatButton 
            icon={<MdAddComment />} 
            type='primary' 
            style={{ right: 20, bottom: 20 }} 
            onClick={() => setOnChat(true)}
        />
        :
        <Row 
            className='border-solid border-2 w-1/6 h-96 rounded-t-xl border-t-0' 
                    style={{ position: 'fixed', right: 20, bottom: 0, borderColor: "#1677ff", backgroundColor: "#e2e9f1" }}
        >
            <Row 
                className='w-full h-10 p-2 border-solid border-b-2 flex items-center justify-between rounded-t-xl'
                style={{ backgroundColor: "#1677ff" }}
            >
                <Col className='text-white'>sada</Col>
                <Col>
                    <Button type='link' onClick={() => setOnChat(false)}
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
                                <Row className={'w-full flex ' + (item.sender === user.id ? 'justify-end' : '')}>
                                    <Row className={'w-fit border-solid border-2 border-black px-1 rounded-lg flex ' + (item.sender === user.id ? 'justify-end' : '')}
                                        style={{ fontFamily: "Signika", backgroundColor: item.receiver === user.id ?  "white" : "#d5f1ff", borderColor: "#d1dfe8" }}
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
                        style={{ fontFamily: "Signika" }} />
                    <Button type='link' onClick={handleChat}
                        className='m-0 p-0 border-none flex items-center'
                    >
                        <AiOutlineSend size={25} />
                    </Button>
                </Row>
            </Row>
        </Row>
    );
}

export default Chat;