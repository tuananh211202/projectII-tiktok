import { Avatar, Badge, Button, Col, Dropdown, Menu, MenuProps, Row } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import Logo from '../Logo';
import SearchBox from '../SearchBox';
import Cookies from 'js-cookie';
import { AiOutlineBell, AiOutlineUserAdd } from 'react-icons/ai';
import { BiUser } from 'react-icons/bi';
import { FiLogOut } from 'react-icons/fi';
import { getNoti, getProfileById } from '../../API';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/provider';
import { socket } from '../Chat';
import { MdMailOutline } from 'react-icons/md';

export const ColorList = ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae'];

const Header = () => {
    const { state, dispatch } = useContext(AppContext);
    const navigate = useNavigate();
    const [user, setUser] = useState({id: 0, name: '', username: '', description: ''});
    const [notis, setNotis] = useState<any[]>([]);

    const handleLogout = () => {
        Cookies.remove('access_token');
        Cookies.remove('user_id');
        dispatch({ type: 'ON_LOGOUT', payload: null });
        navigate('/');
    }

    // useEffect(() => {
    //     getNoti(state.accessToken, state.userId).then(res => setNotis(res.data));
    // }, [state.accessToken, state.userId]);

    useEffect(() => {
        if(state.accessToken !== '') {
            getProfileById(state.userId, setUser);
            getNoti(state.accessToken, state.userId).then(res => setNotis(res.data));
        }
    }, [state.accessToken, state.userId]);

    useEffect(() => {
        socket.on('recNoti', (noti) => {
            if(noti.id === state.userId) getNoti(state.accessToken, state.userId).then(res => setNotis(res.data));
        })
    }, [notis, state.accessToken, state.userId]);

    const items: MenuProps['items'] = [
        {
            key: '0',
            label: (
                <Button type='link' style={{ color: "black" }} href={'/profile/' + user.id}>
                    <Row className='w-24 pl-1 pr-2 flex items-center'>
                        <Col span={10}><BiUser size={14} /></Col>
                        <Col span={14} style={{ fontFamily: "Signika", fontWeight: 500 }}>Profile</Col>
                    </Row>
                </Button>
            )
        },
        {
            key: '1',
            label: (
                <Button type='link' 
                    onClick={handleLogout} 
                    style={{ color: "red" }}
                >
                    <Row className='w-24 pl-1 pr-2 flex items-center'>
                        <Col span={10}><FiLogOut /></Col>
                        <Col span={14} style={{ fontFamily: "Signika", fontWeight: 500 }}>Log out</Col>
                    </Row>
                </Button>
            )
        }
    ];

    return (
        <Row 
            className="w-full border-solid border-b-2 flex items-center px-6 justify-between" 
            style={{ height: "80px", position: 'fixed', top: 0, left: 0 }}
        >
            <Logo />
            <SearchBox />
                <Row className='flex items-center'>
                    <Button 
                        className="mr-2" 
                        style={{ fontSize: "15px", fontFamily: "Signika", fontWeight: 600, backgroundColor: "#F1F1F2" }}
                    >
                        Upload
                    </Button>
                    {
                        state.accessToken   
                        ? 
                        <>
                            <Button type='link' onClick={() => dispatch({ type: "TOGGLE_NOTI", payload: null })}>
                                <Badge count={notis.length} showZero>
                                    <AiOutlineBell size={20} />
                                </Badge>
                            </Button>
                            <Dropdown menu={{ items }} trigger={['click']}>
                                <Avatar className='ml-3' style={{ backgroundColor: ColorList[user.id%4], verticalAlign: 'middle' }}>
                                    <Button className='border-none w-8 h-8 rounded-full text-white flex items-center justify-center'>
                                        {user.name[0] ?? ''}
                                    </Button>
                                </Avatar>
                            </Dropdown>
                        </>
                        :
                        <Button 
                            onClick={() => dispatch({ type: 'OPEN_MODAL', payload: null })}
                            className="text-white"
                            style={{ fontSize: "15px", fontFamily: "Signika", fontWeight: 600, backgroundColor: "#FE2C55" }}
                        >
                            Login
                        </Button>
                    }
                </Row>
        </Row>
    );
}

export default Header;

// TODO: search 