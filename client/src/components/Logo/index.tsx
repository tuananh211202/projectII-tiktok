import { Button } from 'antd';
import React from 'react';

const Logo = () => {
    return (
        <Button 
            type="link" 
            style={{ fontSize: "40px", fontFamily: "Signika", fontWeight: 600 }} className='flex items-center text-black'
        >
            TikGer
        </Button>
    );
}

export default Logo;