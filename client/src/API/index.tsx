import { message } from "antd";
import axios from "axios";
import Cookies from "js-cookie";

export const login = (data: any, openNotificationWithIcon: any, dispatch: any) => { 
    return axios.post('http://localhost:3001/auth/login', data).then(res => {
        Cookies.set('access_token', res.data.access_token, { expires: 1000, path: '/' } );
        Cookies.set('user_id', res.data.user_id, { expires: 1000, path: '/' });
        dispatch({ type: 'ON_LOGIN', payload: {
            userId: res.data.user_id,
            accessToken: res.data.access_token
        }});
        openNotificationWithIcon('success', 'Log in successfull', '');
        dispatch({ type: 'CLOSE_MODAL', payload: null });
    }).catch(error => {
        if(error.response && error.response.status === 401){
            openNotificationWithIcon('error', 'Wrong password', '');
        }
        else if(error.response && error.response.status === 400){
            openNotificationWithIcon('error', 'Wrong username', '');
        }
    });
}

export const signup = (data: any, openNotificationWithIcon: any, setType: any) => { 
    return axios.post('http://localhost:3001/users/signup', data).then(res => {
        openNotificationWithIcon('success', 'Sign up successfull', '');
        setType("login");
    }).catch(error => {
        if(error.response && error.response.status === 409){
            openNotificationWithIcon('error', 'Username or name already exists', '');
        }
    });
}

export const getProfile = (token: string) => { 
    return axios.get('http://localhost:3001/auth/profile', { 
        headers: { Authorization: `Bearer ${token}` }
    });
}

export const updateProfile = (token: string, id: number, data: any, dispatch: any, openNotificationWithIcon: any) => {
    return axios.put('http://localhost:3001/users/profile/' + id, data, {
        headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
        dispatch({ type: 'CLOSE_MODAL', payload: null });
        openNotificationWithIcon('success', 'Save profile successfull!', '');
    });
}

export const updatePassword = (token: string, id: number, data: any, dispatch: any, openNotificationWithIcon: any, navigate: any) => {
    return axios.put('http://localhost:3001/users/profile/password/' + id, data, {
        headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
        dispatch({ type: 'CLOSE_MODAL', payload: null });
        openNotificationWithIcon('info', 'Change password successfull!', 'Please login again!');
        navigate("/");
        dispatch({ type: 'ON_LOGOUT', payload: null });
        dispatch({ type: 'OPEN_MODAL', payload: null });
    }).catch(error => {
        if (error.response && error.response.status === 401) {
            openNotificationWithIcon('error', 'Wrong password', '');
        }
    });
}

export const getProfileById = (id: number, setUser: any) => {
    return axios.get('http://localhost:3001/users/profile/' + id).then(res => setUser(res.data))
    .catch(error => {
        if(error.response && error.response.status === 400){
            setUser({
                id: 0,
                name: '',
                username: '',
                description: ''
            });
        }
    });
}

export const getMessage = (token: string, senderId: number, receiverId: number) => {
    return axios.get('http://localhost:3001/users/message/'+senderId+'/'+receiverId, {
        headers: { Authorization: `Bearer ${token}` }        
    });
}

export const followUser = (token: string, userId: number, id: number) => {
    return axios.post('http://localhost:3001/users/' + userId + '/follow/' + id, {}, {
        headers: { Authorization: `Bearer ${token}` }
    });
}

export const unFollowUser = (token: string, userId: number, id: number) => {
    return axios.delete('http://localhost:3001/users/' + userId + '/follow/' + id, {
        headers: { Authorization: `Bearer ${token}` }
    });
}

export const getNoti = (token: string, id: number) => {
    return axios.get('http://localhost:3001/users/' + id + '/notis', {
        headers: { Authorization: `Bearer ${token}` }
    });
}

export const uploadPost = (token: string, id: number, video: any, data: any) => {
    return axios.post('http://localhost:3001/users/upload', video, {
        headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
        axios.post('http://localhost:3001/users/' + id + '/post', { ...data, driveId: res.data }, {
            headers: { Authorization: `Bearer ${token}` }
        });
    }).catch(err => {
        message.error("Some thing wrong!!!");
    }); 
}

export const getAllPostById = (token: string, id: number) => {
    return axios.get('http://localhost:3001/users/' + id + '/post', {
        headers: { Authorization: `Bearer ${token}` }
    });
}

export const getPostByPostId = (token: string, id: number) => {
    return axios.get('http://localhost:3001/users/watch/' + id, {
        headers: { Authorization: `Bearer ${token}` }
    });
}

export const getFollowingPost = (token: string, id: number) => {
    return axios.get('http://localhost:3001/users/post/' + id, {
        headers: { Authorization: `Bearer ${token}` }
    });
}

export const getAllFollowers = (token: string, id: number) => {
    return axios.get('http://localhost:3001/users/' + id + '/followers', {
        headers: { Authorization: `Bearer ${token}` }
    }).then(res => res.data);
}

export const getAllFollowing = (token: string, id: number) => {
    return axios.get('http://localhost:3001/users/' + id + '/following', {
        headers: { Authorization: `Bearer ${token}` }
    }).then(res => res.data);
}

export const setNotiIsRead = (token: string, id: number) => {
    return axios.put('http://localhost:3001/users/' + id + '/notis', {}, {
        headers: { Authorization: `Bearer ${token}` }
    });
}

export const setAllNotiIsRead = (token: string, id: number, type: string) => {
    return axios.put('http://localhost:3001/users/' + id + '/notis/all', { type }, {
        headers: { Authorization: `Bearer ${token}` }
    });
}

export const getAllReact = (token: string, postId: number) => {
    return axios.get('http://localhost:3001/users/react/' + postId, {
        headers: { Authorization: `Bearer ${token}` }
    });
}

export const getAllComment = (token: string, postId: number) => {
    return axios.get('http://localhost:3001/users/comment/' + postId, {
        headers: { Authorization: `Bearer ${token}` }
    });
}

export const deleteReact = (token: string, postId: number, userId: number) => {
    return axios.delete('http://localhost:3001/users/react/' + postId + '/' + userId, {
        headers: { Authorization: `Bearer ${token}` }
    });
}

export const createComment = (token: string, postId: number, userId: number, description: string) => {
    return axios.post('http://localhost:3001/users/comment/' + postId + '/' + userId, {
        description: description
    },{
        headers: { Authorization: `Bearer ${token}` }
    });
}