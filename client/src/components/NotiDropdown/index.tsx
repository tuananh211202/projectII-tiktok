import { Button, Menu, MenuProps, Pagination, Popover, Row } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { AiOutlineUserAdd } from 'react-icons/ai';
import { MdMailOutline } from 'react-icons/md';
import "./style.css";
import { AppContext } from '../../context/provider';
import { socket } from '../Chat';
import { getNoti, setNotiIsRead } from '../../API';
import HideOnClickOutside from '../HideOnClickOutside';
import { useNavigate } from 'react-router-dom';
import { TiTickOutline } from "react-icons/ti";
import { BsPostcardHeart } from 'react-icons/bs';

const NotiDropdown = () => {
    const { state, dispatch } = useContext(AppContext);
    const [notiType, setNotiType] = useState('message');
    const [notis, setNotis] = useState<any[]>([]);
    const [begin, setBegin] = useState(1);
    const navigate = useNavigate();

    // noti navbar
    const notiTypes: MenuProps['items'] = [
        {
            label: <Row className='w-fit flex items-center' style={{ fontFamily: "Signika", fontWeight: 500 }}>
                <MdMailOutline />
                (<p style={{ fontFamily: "Signika", fontWeight: 500, color: 'red' }}>
                    {notis.filter(item => item.type === 'message' && !item.isRead).length}
                </p>)
            </Row>,
            key: 'message'
        },
        {
            label: <Row className = 'w-fit flex items-center' style = {{ fontFamily: "Signika", fontWeight: 500 }}>
                <AiOutlineUserAdd />
                (<p style={{ fontFamily: "Signika", fontWeight: 500, color: 'red'}}>
                    {notis.filter(item => item.type === 'follower' && !item.isRead).length}
                </p>)
            </Row >,
            key: 'follower'
        },
        {
            label: <Row className='w-fit flex items-center' style={{ fontFamily: "Signika", fontWeight: 500 }}>
                <BsPostcardHeart />
                (<p style={{ fontFamily: "Signika", fontWeight: 500, color: 'red' }}>
                    {notis.filter(item => item.type === 'react' && !item.isRead).length}
                </p>)
            </Row >,
            key: 'react'
        }
    ];

    const onClick: MenuProps['onClick'] = (e) => {
        setNotiType(e.key);
    };
    ////

    useEffect(() => {
        getNoti(state.accessToken, state.userId).then(res => setNotis(res.data));
    }, [state.accessToken, state.userId, state.isNotiOpen]);

    useEffect(() => {
        socket.on('recNoti', (noti) => {
            if (noti.id === state.userId) getNoti(state.accessToken, state.userId).then(res => setNotis(res.data));
        })
    }, [notis, state.accessToken, state.userId, state.isNotiOpen]);

    const onHide = () => {
        dispatch({ type: "CLOSE_NOTI", payload: null });
    }
    
    const handleClick = (idString: string, type: string, id: number) => {
        const idNumber = parseInt(idString ?? '0');
        
        setNotiIsRead(state.accessToken, id);

        notiType === "message" ? dispatch({ type: "OPEN_CHAT", payload: { onChat: idNumber } }) : navigate("/profile/" + idNumber );

        dispatch({ type: "CLOSE_NOTI", payload: null });
    }

    const handleReadAll = () => {
        notis.filter(item => item.type === notiType).map(item => {
            setNotiIsRead(state.accessToken, item.id);
            return item;
        });

        dispatch({ type: "CLOSE_NOTI", payload: null });    
    }

    useEffect(() => {
        if(notis.length !== 0 && state.onChat !== 0){
            notis.filter(item => item.type === "message").map(item => {
                const idString = item.description.split("|")[0];
                if(state.onChat === parseInt(idString ?? '0')) {
                    setNotiIsRead(state.accessToken, item.id);
                }
                return item;
            })
        }
    }, [state.onChat, state.isOnChat, state.accessToken]);

    return (
        state.isNotiOpen ? 
            <HideOnClickOutside onHide={onHide}>
                <Row 
                    style={{ 
                        backgroundColor: "white",
                        width: "300px",
                        height: "410px",
                        position: "fixed",
                        top: 60,
                        right: 23
                    }}
                    className='dropdown-boxshadow rounded-lg relative z-10'
                >
                    <Menu onClick={onClick} selectedKeys={[notiType]} mode='horizontal' items={notiTypes} className='h-fit w-full' />
                    <Row className='absolute top-3 right-3'>
                        <Popover content="Mark all as read">
                            <Button type='link' className='m-0 p-0 w-fit h-fit' onClick={handleReadAll}>
                                <TiTickOutline size={20} />
                            </Button>
                        </Popover>
                    </Row>
                    <Row className='absolute top-12 left-0 p-2 w-full'>
                        {
                            notis.filter(item => item.type === notiType).slice(begin * 10 - 10,begin * 10).map(item => {
                                const [idString, content] = item.description.split("|");
                                return  <>
                                    <Button 
                                        type={item.isRead ? 'text' : 'link'} 
                                        className='w-full inline-block'
                                        onClick={() => handleClick(idString, item.type, item.id)}
                                    >
                                        <p className='w-full h-fit' 
                                            style={{ 
                                                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' ,
                                                fontFamily: "Signika"
                                            }}
                                        >
                                            {content}
                                        </p>
                                    </Button>
                                </>
                            })
                        }
                    </Row>
                    <Pagination simple size='small' total={notis.filter(item => item.type === notiType).length} pageSize={10} className='flex items-center h-fit absolute bottom-1 right-0'
                        style={{ fontFamily: "Signika" }} onChange={(page) => setBegin(page)}
                    />
                </Row>
            </HideOnClickOutside>
        : null
    );
};

export default NotiDropdown;