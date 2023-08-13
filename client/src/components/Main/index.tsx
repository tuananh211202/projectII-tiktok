import { Row } from 'antd';
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Profile from '../Profile';
import Cookies from 'js-cookie';
import Homepage from '../Homepage';
import UploadModal from '../UploadModal';
import Following from '../Following';
import DetailsPost from '../DetailsPost';

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
                        <Route path='/upload' element={<UploadModal />} />
                        <Route path='/following' element={<Following />} />
                        <Route path='/post/:id' element={<DetailsPost />} />
                    </> : null
                }      
            </Routes>    
        </Row>
    );
}

export default Main;