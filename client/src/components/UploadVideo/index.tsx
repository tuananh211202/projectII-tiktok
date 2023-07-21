import React, { useState } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { Button, message, Row, Upload } from 'antd';
import { BsUpload } from "react-icons/bs";
import axios from 'axios';

const UploadVideo = (props: any) => {
    const [videoSrc, setVideoSrc] = useState('');
    const { video, setVideo } = props;
    const handleChange = (e: any) => {
        if(e.target.files[0]){
            setVideo(e.target.files[0]);
            const url = URL.createObjectURL(e.target.files[0]);
            setVideoSrc(url);
        } else setVideoSrc('');
    };

    const handlePost = async () => {
        const formData = new FormData();
        formData.append('video', video, video.name);
        await axios.post('http://localhost:3001/users/upload', formData).then(res => console.log(res.data));
    }

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