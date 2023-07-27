import { Avatar, Button, Col, Divider, Row } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { FiHome, FiUsers, FiCompass } from "react-icons/fi";
import { HiOutlineVideoCamera, HiOutlineShoppingBag } from "react-icons/hi";
import { getAllFollowing } from '../../API';
import { AppContext } from '../../context/provider';
import { ColorList } from '../Header';
import { socket } from '../Chat';
import { useNavigate } from 'react-router-dom';

const SideBar = () => {
    const data = [1,2,3,4,5,6,7,8,9,10];
    const { state, dispatch } = useContext(AppContext);
    const navigate = useNavigate();

    const [following, setFollowing] = useState<any[]>([]);

    useEffect(() => {
        if(state.accessToken !== '')
            getAllFollowing(state.accessToken, state.userId).then(data => setFollowing(data));
    }, [state.accessToken, state.userId]);

    useEffect(() => {
        socket.on('recNoti', (noti) => {
            getAllFollowing(state.accessToken, state.userId).then(data => setFollowing(data));
        })
    }, [state.accessToken, state.userId, following]);

    return (
        <Row 
            className="w-48"
            style={{ height: "710px", position: "fixed", left: 0, top: 80 }}
        >
            <Row className="w-full  h-1/3">
                <Button type='text' className="w-full h-10 mt-1" onClick={() => navigate("/Following")}>
                    <Row className='w-full flex items-center justify-center'>
                        <Col span={4}>
                            <FiHome size={24} />
                        </Col>
                        <Col span={20} style={{ fontSize: "20px", fontFamily: "Signika", fontWeight: 600 }}>
                            For you
                        </Col>
                    </Row>
                </Button>

                <Button type='text' className="w-full h-10 mt-1" onClick={() => navigate("/following")}>
                    <Row className='w-full flex items-center justify-center'>
                        <Col span={4}>
                            <FiUsers size={24} />
                        </Col>
                        <Col span={20} style={{ fontSize: "20px", fontFamily: "Signika", fontWeight: 600 }}>
                            Following
                        </Col>
                    </Row>
                </Button>

                <Button type='text' className="w-full h-10 mt-1" onClick={() => navigate("/explore")}>
                    <Row className='w-full flex items-center justify-center'>
                        <Col span={4}>
                            <FiCompass size={24} />
                        </Col>
                        <Col span={20} style={{ fontSize: "20px", fontFamily: "Signika", fontWeight: 600 }}>
                            Explore
                        </Col>
                    </Row>
                </Button>

                <Button type='text' className="w-full h-10 mt-1" onClick={() => navigate("/live")}>
                    <Row className='w-full flex items-center justify-center'>
                        <Col span={4}>
                            <HiOutlineVideoCamera size={24} />
                        </Col>
                        <Col span={20} style={{ fontSize: "20px", fontFamily: "Signika", fontWeight: 600 }}>
                            Live
                        </Col>
                    </Row>
                </Button>

                <Button type='text' className="w-full h-10 mt-1" onClick={() => navigate("/shop")}>
                    <Row className='w-full flex items-center justify-center'>
                        <Col span={4}>
                            <HiOutlineShoppingBag size={24} />
                        </Col>
                        <Col span={20} style={{ fontSize: "20px", fontFamily: "Signika", fontWeight: 600 }}>
                            Shop
                        </Col>
                    </Row>
                </Button>
            </Row>
            <Row className='w-full h-2/3 block'>
                <Divider className='m-0 p-0' />
                <Row className='w-full px-2 pt-4 pb-2 text-lg' style={{ fontFamily: "Signika", fontWeight: 500 }}>Following accounts</Row>
                <Row className='w-full overflow-y-auto h-5/6 block'>
                {
                    following.map(user => (
                        <Row className='w-full py-2 px-4'>
                            <Button type="link" className='w-full m-0 p-0 flex items-center' onClick={() => navigate("/profile/" + user.user.id)}>
                                <Avatar style={{ backgroundColor: ColorList[user.user.id % 4], verticalAlign: 'middle' }}>{user.user.name[0] ?? ''}</Avatar>
                                <Row className='px-2 inline-block w-3/4'>
                                    <p className='w-full h-fit'
                                        style={{
                                            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                                            fontFamily: "Signika", color: ColorList[user.user.id % 4]
                                        }}
                                    >
                                        {user.user.name}
                                    </p>
                                </Row>
                            </Button>
                        </Row>
                    ))
                }
                </Row>
            </Row>
        </Row>
    );
}

export default SideBar;