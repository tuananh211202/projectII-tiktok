import { Button, Menu, MenuProps, Pagination, Row } from 'antd';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { AiOutlineUserAdd } from 'react-icons/ai';
import { MdMailOutline } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import "./style.css";
import { AppContext } from '../../context/provider';
import { socket } from '../Chat';
import { getNoti } from '../../API';

const NotiDropdown = () => {
    const { state, dispatch } = useContext(AppContext);
    const [notiType, setNotiType] = useState('message');
    const [notis, setNotis] = useState<any[]>([]);

    // noti navbar
    const notiTypes: MenuProps['items'] = [
        {
            label: <Row className='w-fit flex items-center' style={{ fontFamily: "Signika", fontWeight: 500 }}>
                <MdMailOutline />
                Message(<p style={{ fontFamily: "Signika", fontWeight: 500, color: 'red' }}>
                    {notis.filter(item => item.type === 'message' && !item.isRead).length}
                </p>)
            </Row>,
            key: 'message'
        },
        {
            label: <Row className = 'w-fit flex items-center' style = {{ fontFamily: "Signika", fontWeight: 500 }}>
                <AiOutlineUserAdd />
                Follower(<p style={{ fontFamily: "Signika", fontWeight: 500, color: 'red'}}>
                    {notis.filter(item => item.type === 'follower' && !item.isRead).length}
                </p>)
            </Row >,
            key: 'follower'
        }
    ];

    const onClick: MenuProps['onClick'] = (e) => {
        setNotiType(e.key);
    };
    ////

    useEffect(() => {
        getNoti(state.accessToken, state.userId).then(res => setNotis(res.data));
    }, [state.accessToken, state.userId]);

    useEffect(() => {
        socket.on('recNoti', (noti) => {
            console.log(noti);
            if (noti.id === state.userId) getNoti(state.accessToken, state.userId).then(res => setNotis(res.data));
        })
    }, [notis, state.accessToken, state.userId, state.isNotiOpen]);

    return (
        state.isNotiOpen ? 
                <Row 
                    style={{ 
                        backgroundColor: "white",
                        width: "300px",
                        height: "410px",
                        position: "fixed",
                        top: 60,
                        right: 23
                    }}
                    className='dropdown-boxshadow rounded-lg relative'
                >
                    <Menu onClick={onClick} selectedKeys={[notiType]} mode='horizontal' items={notiTypes} className='h-fit w-full' />
                    <Row className='absolute top-12 left-0 p-2 w-full'>
                        {
                            notis.filter(item => item.type === notiType).map(item => 
                            <Button type={item.isRead ? 'text' : 'link'} className='w-full inline-block'>
                                <p className='w-full h-fit' 
                                    style={{ 
                                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' ,
                                        fontFamily: "Signika"
                                    }}
                                >
                                    {item.description}
                                </p>
                            </Button>)
                        }
                    </Row>
                    <Pagination simple size='small' total={notis.filter(item => item.type === notiType).length} pageSize={5} className='flex items-center h-fit absolute bottom-1 right-0'
                        style={{ fontFamily: "Signika" }} 
                    />
                </Row>
        : null
    );
};

export default NotiDropdown;