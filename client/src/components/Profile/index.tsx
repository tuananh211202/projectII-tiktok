import { Row, Result, Button, Col, Avatar } from 'antd';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProfile, getProfileById } from '../../API';
import { ColorList } from '../Header';
import { AiOutlineMessage } from 'react-icons/ai';
import { FiLogOut } from 'react-icons/fi';
import Cookies from 'js-cookie';

const Profile = () => {
    const {id: userId} = useParams<string>();
    const access_token = Cookies.get('access_token') ?? '';
    const [isCurrent, setIsCurrent] = useState(false);
    const [user, setUser] = useState({
        id: 0,
        name: '',
        username: '',
        description: ''
    });

    useEffect(() => {
        getProfileById(parseInt(userId ?? '0'), setUser);
    } ,[userId]);

    useEffect(() => {
        getProfile(access_token).then(res => setIsCurrent(res.data.id === user.id));
    }, [user, access_token]);

    return (
        <Row className='w-full p-10 flex items-center justify-center'>
            {user.id === 0 ? 
                <Result
                    status="404"
                    title="404"
                    subTitle="Sorry, the page you visited does not exist."
                    extra={<Button style={{ fontFamily: "Signika" }}>Back To Explore</Button>}
                    style={{ fontFamily: "Signika" }}
                />
            : 
                <Row className='w-full'>
                    <Row className='w-full'>
                        <Col>
                            <Avatar size={90} style={{ backgroundColor: ColorList[user.id % 4], verticalAlign: 'middle' }}>
                                    {user.name[0] ?? ''}
                            </Avatar>
                        </Col>
                        <Col className='pl-2'>
                            <Row className='w-full text-3xl' style={{ fontFamily: "Signika", height: "45px" }}>{user.name}</Row>
                            <Row className='w-full flex items-end' style={{ height: "45px" }}>
                                <Col>
                                    <Button className='border-2 flex items-center justify-center' 
                                        style={{ fontFamily: "Signika", fontWeight: "500", fontSize: "16px", color: isCurrent ? "black" : "red", width: "150px", height: "35px" }}
                                    >
                                        {isCurrent ? "Edit profile" : "Follow"}
                                    </Button>
                                </Col>
                                <Col>
                                    <Button type='link' className='px-1'>
                                        {isCurrent ? <FiLogOut size={25} color='black' /> : <AiOutlineMessage size={25} color='red' />}
                                    </Button>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Row>
            }
        </Row>
    );
}

export default Profile;