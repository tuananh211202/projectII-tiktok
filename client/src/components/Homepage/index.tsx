import { Row } from 'antd';
import React from 'react';
import { PiTiktokLogoBold, PiMessengerLogoBold } from "react-icons/pi";
import { FaPlus } from "react-icons/fa";

const Homepage = () => {
    return (   
        <Row className='w-full flex items-center justify-center'>
            <Row className='w-1/2'>
                <Row 
                    className='w-full'
                    style={{ fontSize: "100px", fontFamily: "Signika", fontWeight: 600 }}
                >TikGer</Row>
                <Row 
                    className='w-full'
                    style={{ fontSize: "25px", fontFamily: "Signika", fontWeight: 400 }}
                >Tiktok and Messenger</Row>
                <Row 
                    className='w-full'
                    style={{ fontSize: "20px", fontFamily: "Signika", fontWeight: 300 }}
                >
                    A convenient and useful platform for posting videos, chatting with friends.
                </Row>
                <Row className='w-full flex justify-between items-center'>
                    <PiTiktokLogoBold size={100} color='red' />
                    <FaPlus size={25} />
                    <PiMessengerLogoBold size={100} color='blue' />
                </Row>
                <Row
                    className='w-full'
                    style={{ fontSize: "25px", fontFamily: "Signika", fontWeight: 400 }}
                >
                    Some feature
                </Row>
                <Row 
                    className='w-full px-5'
                >
                    <Row className='w-full' style={{ fontSize: "20px", fontFamily: "Signika", fontWeight: 300 }}>&bull;Watch your friend's video</Row>
                    <Row className='w-full' style={{ fontSize: "20px", fontFamily: "Signika", fontWeight: 300 }}>&bull;watch videos with interesting content for you</Row>
                    <Row className='w-full' style={{ fontSize: "20px", fontFamily: "Signika", fontWeight: 300 }}>&bull;Buy something that you need</Row>
                    <Row className='w-full' style={{ fontSize: "20px", fontFamily: "Signika", fontWeight: 300 }}>&bull;Following and chatting with your friend</Row>
                </Row>
            </Row>
        </Row>
    );
}

export default Homepage;