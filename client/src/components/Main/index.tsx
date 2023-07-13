import { Row } from 'antd';
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Profile from '../Profile';
import Cookies from 'js-cookie';
import Homepage from '../Homepage';

const Main = () => {
    const access_token = Cookies.get('access_token');
    return (
        <Row className='w-10/12'
            style={{ position: "fixed", top: 80, left: 192 }}
        >
            <Routes>
                <Route path='/' element={<Homepage />} />
                {
                    access_token ?
                    <>
                        <Route path='/profile/:id' element={<Profile />} />
                    </> : null
                }      
            </Routes>    
        </Row>
    );
}

export default Main;