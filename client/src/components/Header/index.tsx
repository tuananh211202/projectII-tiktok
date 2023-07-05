import { Avatar, Badge, Button, Col, Dropdown, MenuProps, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import Logo from '../Logo';
import SearchBox from '../SearchBox';
import Cookies from 'js-cookie';
import { AiOutlineBell } from 'react-icons/ai';
import { BiUser } from 'react-icons/bi';
import { FiLogOut } from 'react-icons/fi';
import { getProfile } from '../../API';

const ColorList = ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae'];



const Header = (props: any) => {
    const { modalOpen, setModalOpen } = props;
    const [accessToken, setAccessToken] = useState(Cookies.get('access_token') ?? '');
    const [user, setUser] = useState({id: 0, name: '', email: '', description: ''});

    const items: MenuProps['items'] = [
        {
            key: '0',
            label: (
                <Button type='link' style={{ color: "black" }}>
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
                    onClick={() => { Cookies.remove('access_token');setAccessToken(''); }} 
                    style={{ color: "red" }}
                >
                    <Row className='w-24 pl-1 pr-2 flex items-center'>
                        <Col span={10}><FiLogOut /></Col>
                        <Col span={14} style={{ fontFamily: "Signika", fontWeight: 500 }}>Log out</Col>
                    </Row>
                </Button>
            )
        }
    ]
    
    useEffect(() => setAccessToken(Cookies.get('access_token') ?? ''),[modalOpen]);

    useEffect(() => {
        if(accessToken !== '') getProfile(accessToken).then(res => setUser(res.data));
    },[accessToken]);

    return (
        <Row 
            className="w-full border-solid border-b-2 flex items-center px-6 justify-between" 
            style={{ height: "80px" }}
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
                        accessToken 
                        ? 
                        <>
                            <Badge count={0} showZero>
                                <AiOutlineBell size={20} />
                            </Badge>
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
                            onClick={() => setModalOpen(true)}
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

// TODO: search + noti