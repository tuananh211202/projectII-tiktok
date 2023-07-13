import { Button } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Logo = () => {
    const navigate = useNavigate();
    return (
        <Button 
            type="link" 
            style={{ fontSize: "40px", fontFamily: "Signika", fontWeight: 600 }} className='flex items-center text-black'
            onClick={() => navigate('/')}
        >
            TikGer
        </Button>
    );
}

export default Logo;