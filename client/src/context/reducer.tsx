import Cookies from "js-cookie";

export const initialState = {
    isOnChat: false,
    onChat: parseInt(Cookies.get('on_chat') ?? '0'),
    userId: parseInt(Cookies.get('user_id') ?? '0'),
    accessToken: Cookies.get('access_token') ?? '',
    isModalOpen: false,
    isNotiOpen: false,
    postId: 0
};

export const appReducer = (state: any, action: any) => {
    switch (action.type){
        case 'OPEN_CHAT': 
            return {
                ...state,
                isOnChat: true,
                onChat: action.payload.onChat
            };
        case 'CLOSE_CHAT': 
            return {
                ...state,
                isOnChat: false
            };
        case 'ON_LOGIN':
            return {
                ...state,
                isModalOpen: false,
                userId: action.payload.userId,
                accessToken: action.payload.accessToken
            };
        case 'ON_LOGOUT':
            return  {
                ...state,
                userId: 0,
                accessToken: ''
            };
        case 'OPEN_MODAL':
            return {
                ...state,
                isModalOpen: true
            };
        case 'CLOSE_MODAL': 
            return {
                ...state,
                isModalOpen: false
            }
        case 'TOGGLE_NOTI':
            return {
                ...state,
                isNotiOpen: !state.isNotiOpen
            }
        case 'CLOSE_NOTI':
            return {
                ...state,
                isNotiOpen: false
            }  
        case 'TOOGLE_DETAIL':
            return {
                ...state,
                postId: action.payload.id
            }
        default:
            return state;
    }
}