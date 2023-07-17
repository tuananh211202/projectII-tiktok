import React, { useState } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { Button, message, Row, Upload } from 'antd';
import { BsUpload } from "react-icons/bs";

const UploadVideo: React.FC = () => {
    const [videoSrc, setVideoSrc] = useState('');
    const handleChange = (e: any) => {
        if(e.target.files[0]){
            console.log(e.target.files[0]);
            console.log(typeof e.target.files[0]);
            const url = URL.createObjectURL(e.target.files[0]);
            setVideoSrc(url);
            console.log(url);
        } else setVideoSrc('');
    };

    return <>
        <Row className='w-full rounded-lg' style={{ height: "90%", backgroundColor: "#D9D9D9" }}>
            {videoSrc === '' ? 
                <Row 
                    className='w-full h-full rounded-lg border-dotted border-2 border-black flex items-center justify-center'
                    style={{ backgroundColor: "#D9D9D9" }}
                >
                    <BsUpload size={100} />
                </Row>
            :
                <video 
                    controls 
                    className='w-full h-full rounded-lg' 
                    src={videoSrc} 
                />
            }
        </Row>
        <input 
            type='file' 
            accept='video/mp4' onChange={handleChange}
            className='w-full py-2' 
            style={{ fontFamily: "Signika", fontWeight: 500, height: "10%" }}
        />
    </>
};

export default UploadVideo;