import axios from "axios";
import Cookies from "js-cookie";

export const login = (data: any, openNotificationWithIcon: any, setModalOpen: any) => { 
    return axios.post('http://localhost:3001/auth/login', data).then(res => {
        Cookies.set('access_token', res.data.access_token, { expires: 1000, path: '/' } );
        openNotificationWithIcon('success', 'Log in successfull', '');
        setModalOpen(false);
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
            openNotificationWithIcon('error', 'User already exists', '');
        }
    });
}

export const getProfile = (token: string) => { 
    return axios.get('http://localhost:3001/auth/profile', { 
        headers: { Authorization: `Bearer ${token}` }
     });
}