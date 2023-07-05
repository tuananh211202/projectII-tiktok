import { Button, Col, Row } from 'antd';
import React from 'react';
import { FiHome, FiUsers, FiCompass } from "react-icons/fi";
import { HiOutlineVideoCamera, HiOutlineShoppingBag } from "react-icons/hi";

const SideBar = () => {
    return (
        <Row 
            className="w-full bg-black"
            style={{ height: "710px" }}
        >
            <Row className="w-full bg-white h-1/3">
                <Button type='text' className="w-full h-10 mt-1">
                    <Row className='w-full flex items-center justify-center'>
                        <Col span={4}>
                            <FiHome size={24} />
                        </Col>
                        <Col span={20} style={{ fontSize: "20px", fontFamily: "Signika", fontWeight: 600 }}>
                            For you
                        </Col>
                    </Row>
                </Button>

                <Button type='text' className="w-full h-10 mt-1">
                    <Row className='w-full flex items-center justify-center'>
                        <Col span={4}>
                            <FiUsers size={24} />
                        </Col>
                        <Col span={20} style={{ fontSize: "20px", fontFamily: "Signika", fontWeight: 600 }}>
                            Following
                        </Col>
                    </Row>
                </Button>

                <Button type='text' className="w-full h-10 mt-1">
                    <Row className='w-full flex items-center justify-center'>
                        <Col span={4}>
                            <FiCompass size={24} />
                        </Col>
                        <Col span={20} style={{ fontSize: "20px", fontFamily: "Signika", fontWeight: 600 }}>
                            Explore
                        </Col>
                    </Row>
                </Button>

                <Button type='text' className="w-full h-10 mt-1">
                    <Row className='w-full flex items-center justify-center'>
                        <Col span={4}>
                            <HiOutlineVideoCamera size={24} />
                        </Col>
                        <Col span={20} style={{ fontSize: "20px", fontFamily: "Signika", fontWeight: 600 }}>
                            Live
                        </Col>
                    </Row>
                </Button>

                <Button type='text' className="w-full h-10 mt-1">
                    <Row className='w-full flex items-center justify-center'>
                        <Col span={4}>
                            <HiOutlineShoppingBag size={24} />
                        </Col>
                        <Col span={20} style={{ fontSize: "20px", fontFamily: "Signika", fontWeight: 600 }}>
                            Shop
                        </Col>
                    </Row>
                </Button>
            </Row>
        </Row>
    );
}

export default SideBar;