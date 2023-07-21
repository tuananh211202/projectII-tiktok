import { Button, Col, Form, Input, InputNumber, Radio, Row, Select, message } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UploadVideo from '../UploadVideo';
import { uploadPost } from '../../API';
import { AppContext } from '../../context/provider';

const UploadModal = () => {
    const navigate = useNavigate();
    const [video, setVideo] = useState<any>();
    const { state, dispatch } = useContext(AppContext);

    const [form] = Form.useForm();
    const [disabled, setDisabled] = useState(true);

    useEffect(() => {
        form.resetFields();
    },[]);

    const handlePost = () => {
        const data = form.getFieldsValue(); 
        const formData = new FormData();
        formData.append('video', video, video.name);
        uploadPost(state.accessToken, state.userId, formData, {
            description: data.description,
            cost: data.cost,
            permission: data.permission + (data.noti === 1 ? 'n' : '')
        }).then(() => 
        {  
                message.success("You have successfully posted");
                navigate("/profile/" + state.userId)
        });
    }

    const handleCancel = () => {
        navigate("/user");
    }

    const handleSelect = (value: any) => {
        if(value === "Product") setDisabled(false);
        else {
            form.setFieldValue("cost", 0);
            setDisabled(true);
        }
    }

    const initialValue = {
        description: "",
        type: "Video",
        permission: "rc",
        noti: 1,
        cost: 0
    }

    return (
        <Row className='w-full bg-white px-48 py-20' style={{ position: "fixed", top: 80, left: 0, height: "90vh" }}>
            <Col span={8} className='h-full'>
                <UploadVideo video={video} setVideo={setVideo} />
            </Col>
            <Col span={16} className='h-full px-10 relative'>
                <Form className='w-full' initialValues={initialValue} form={form}>
                    <Row className='w-full mb-2 text-lg' style={{ fontFamily: "Signika", fontWeight: 500 }}>Description</Row>
                    <Row className='w-full mb-2'>
                        <Form.Item name="description" className='w-full'>
                            <Input.TextArea className='w-full' rows={5} style={{ fontFamily: "Signika", fontWeight: 500 }} />                            
                        </Form.Item>
                    </Row>
                    <Row className='w-full mb-2'>
                        <Col span={12}>
                            <Row>
                                <Col span={4} className='w-fit text-lg' style={{ fontFamily: "Signika", fontWeight: 500 }}>Type</Col>
                                <Col span={20}>
                                    <Form.Item name="type" className='w-1/2 text-xl'>
                                        <Select style={{ fontFamily: "Signika", fontWeight: 500 }} onChange={handleSelect}>
                                            <Select.Option value="Video" label="Video" style={{ fontFamily: "Signika", fontWeight: 500 }}>
                                            </Select.Option>
                                            <Select.Option value="Product" label="Product" style={{ fontFamily: "Signika", fontWeight: 500 }}>
                                            </Select.Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Col>
                        <Col span={12}>
                            <Row>
                                <Col span={4} className='w-fit text-lg' style={{ fontFamily: "Signika", fontWeight: 500 }}>Cost</Col>
                                <Col span={20}>
                                    <Form.Item name="cost" className='w-1/2 text-xl'>
                                        <InputNumber style={{ fontFamily: "Signika", fontWeight: 500 }} addonBefore="$" disabled={disabled} />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row className='w-full mb-2 text-lg' style={{ fontFamily: "Signika", fontWeight: 500 }}>Allow users to</Row>
                    <Row className='w-full mb-2'>
                        <Form.Item name="permission" className='w-full'>
                            <Radio.Group className='w-full'>
                                <Row className='w-full'>
                                    <Col span={12}>
                                        <Radio value="r" className='w-full text-lg' style={{ fontFamily: "Signika", fontWeight: 500 }}>
                                            Only react
                                        </Radio>
                                    </Col>
                                    <Col span={12}>
                                        <Radio value="c" className='w-full text-lg' style={{ fontFamily: "Signika", fontWeight: 500 }}>
                                            Only comment
                                        </Radio>
                                    </Col>
                                    <Col span={24}>
                                        <Radio value="rc" className='w-full text-lg' style={{ fontFamily: "Signika", fontWeight: 500 }}>
                                            React and comment
                                        </Radio>
                                    </Col>
                                </Row>
                            </Radio.Group>
                        </Form.Item>
                    </Row>
                    <Row className='w-full mb-2 text-lg' style={{ fontFamily: "Signika", fontWeight: 500 }}>Notification</Row>
                    <Row className='w-full mb-2'>
                        <Form.Item name="noti" className='w-full'>
                            <Radio.Group className='w-full'>
                                <Row className='w-full'>
                                    <Col span={12}>
                                        <Radio value={1} className='w-full text-lg' style={{ fontFamily: "Signika", fontWeight: 500 }}>
                                            On
                                        </Radio>
                                    </Col>
                                    <Col span={12}>
                                        <Radio value={0} className='w-full text-lg' style={{ fontFamily: "Signika", fontWeight: 500 }}>
                                            Off
                                        </Radio>
                                    </Col>
                                </Row>
                            </Radio.Group>
                        </Form.Item>
                    </Row>
                </Form>
                <Row className='absolute bottom-0 right-0 px-10'>
                    <Button className='border-2 mr-2' style={{fontFamily: "Signika", fontWeight: 500 }} onClick={() => handleCancel()}>Cancel</Button>
                    <Button className='text-white border-2' style={{ backgroundColor: "red", fontFamily: "Signika", fontWeight: 500 }} onClick={() => handlePost()}>Post</Button>
                </Row>
            </Col>
        </Row>
    );
}

export default UploadModal;