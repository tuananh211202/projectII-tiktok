import React, { createContext, useReducer } from "react";
import { appReducer, initialState } from "./reducer";

interface StateInterface {
    isOnChat: boolean;
    onChat: number;
    userId: number;
    accessToken: string;
    isModalOpen: boolean;
    isNotiOpen: boolean;
}

type ActionType = 
    | {type: 'OPEN_CHAT'; payload: { onChat: number }}
    | {type: 'CLOSE_CHAT'; payload: any}
    | {type: 'ON_LOGIN'; payload: { userId: number, accessToken: string }}
    | {type: 'ON_LOGOUT'; payload: any}
    | {type: 'OPEN_MODAL'; payload: any}
    | {type: 'CLOSE_MODAL'; payload: any}
    | {type: 'TOGGLE_NOTI'; payload: any}
;

export const AppContext = createContext<{ state: StateInterface; dispatch: React.Dispatch<ActionType> }>({
    state: initialState,
    dispatch: () => null
});

export const AppProvider = (props: any) => {
    const [state, dispatch] = useReducer(appReducer, initialState);

    return (
        <AppContext.Provider value={{
            state, dispatch
        }}>
            {props.children}
        </AppContext.Provider>
    )
}
