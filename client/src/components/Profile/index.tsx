import { Row, Result, Button, Col, Avatar } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getAllFollowers, getAllFollowing, getAllPostById, getProfile, getProfileById, unFollowUser } from '../../API';
import { ColorList } from '../Header';
import { AiOutlineMessage } from 'react-icons/ai';
import { FiLogOut } from 'react-icons/fi';
import Cookies from 'js-cookie';
import { AppContext } from '../../context/provider';
import { socket } from '../Chat';

const Profile = () => {
    const {id: userId} = useParams<string>();
    const { state, dispatch } = useContext(AppContext);
    const [ text, setText ] = useState('Follow');
    const navigate = useNavigate();
    const [isCurrent, setIsCurrent] = useState(false);
    const [user, setUser] = useState({
        id: 0,
        name: '',
        username: '',
        description: ''
    });
    const [posts, setPosts] = useState<any[]>([]);
    const [following, setFollowing] = useState<any[]>([]);
    const [followers, setFollowers] = useState<any[]>([]);

    useEffect(() => {
        getProfileById(parseInt(userId ?? '0'), setUser);
    } ,[userId, state.isModalOpen]);

    useEffect(() => {
        if(state.accessToken !== '') {
            getProfile(state.accessToken).then(res => setIsCurrent(res.data.id === user.id));
            getAllPostById(state.accessToken, parseInt(userId ?? '0')).then(res => setPosts(res.data));
            getAllFollowers(state.accessToken, parseInt(userId ?? '0')).then(data => setFollowers(data));
            getAllFollowing(state.accessToken, parseInt(userId ?? '0')).then(data => setFollowing(data));
            getAllFollowing(state.accessToken, state.userId)
            .then(data => {
                data.map((item: any) => item.user.id).includes(userId) ? setText("Unfollow") : setText("Follow");
            })
        }
    }, [user, state.accessToken, state.userId, userId]);

    useEffect(() => {
        socket.on('recNoti', (noti) => {
            if (noti.id === state.userId){
                getAllFollowers(state.accessToken, parseInt(userId ?? '0')).then(data => setFollowers(data));
            }
        })
    }, [user, state.accessToken, state.userId, userId, followers]);

    useEffect(() => {
        if (state.accessToken !== '') {
            getAllFollowers(state.accessToken, parseInt(userId ?? '0')).then(data => setFollowers(data));
            getAllFollowing(state.accessToken, parseInt(userId ?? '0')).then(data => setFollowing(data));
        }
    }, [user, state.accessToken, userId, text]);

    const handleClickLargeButton = () => {
        if(isCurrent){
            dispatch({ type: 'OPEN_MODAL', payload: null });
        } else {
            if(text === 'Follow'){
                socket.emit('followUser', { userId: state.userId, id: parseInt(userId ?? '0') });
                setText('Unfollow');
            }else {
                unFollowUser(state.accessToken, state.userId, parseInt(userId ?? '0'));
                setText('Follow');
            }
        }
    }

    const handleClickMiniButton = () => {
        if(isCurrent) {
            dispatch({ type: 'ON_LOGOUT', payload: null });
            navigate("/");
            Cookies.remove('access_token');
            Cookies.remove('user_id');
        } else {
            dispatch({ type: 'OPEN_CHAT', payload: { onChat: parseInt(userId ?? '0') }});
            Cookies.set('on_chat', userId ?? '0');
        }
    }

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
                                        onClick={() => handleClickLargeButton()}
                                    >
                                        {isCurrent ? "Edit profile" : text}
                                    </Button>
                                </Col>
                                <Col>
                                    <Button type='link' className='px-1' onClick={() => handleClickMiniButton()}>
                                        {isCurrent ? <FiLogOut size={25} color='black' /> : <AiOutlineMessage size={25} color='red' />}
                                    </Button>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row className='w-full pt-4 text-lg' style={{ fontFamily: "Signika" }}>
                        <Row className='w-fit px-4'>
                            <Col className='w-fit pr-2 text-lg' style={{ fontFamily: "Signika", fontWeight: 700 }}>{following.length}</Col>
                            <Col className='w-fit text-lg' style={{ fontFamily: "Signika", fontWeight: 300}}>Following</Col>
                        </Row>
                        <Row className='w-fit px-4'>
                            <Col className='w-fit pr-2 text-lg' style={{ fontFamily: "Signika", fontWeight: 700 }}>{followers.length}</Col>
                            <Col className='w-fit text-lg' style={{ fontFamily: "Signika", fontWeight: 300 }}>Followers</Col>
                        </Row>
                    </Row>
                    <Row className='w-full mt-2'>
                        {
                            posts.map(post => {
                                return (
                                    <Col span={6} className='h-96 p-2'>
                                        <Row className='w-full bg-black rounded-lg' style={{ height: "90%" }}>
                                            <Button type='link' className='w-full h-full m-0 p-0'>
                                                <video className='w-full h-full rounded-lg'>
                                                    <source src={"https://drive.google.com/uc?export=download&id="+post.driveId} type="video/mp4" />
                                                </video>
                                            </Button>
                                        </Row>
                                        <Row className='w-full p-1' style={{ height: "10%" }}>
                                            <p className='w-full h-full'
                                                style={{
                                                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                                                    fontFamily: "Signika"
                                                }}
                                            >
                                                {post.description}
                                            </p>
                                        </Row>
                                    </Col>
                                );
                            })
                        }
                    </Row>
                </Row>
            }
        </Row>
    );
}

export default Profile;