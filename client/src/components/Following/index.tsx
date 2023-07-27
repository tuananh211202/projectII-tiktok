import { Avatar, Button, Col, Row } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { AiFillCaretDown, AiFillCaretUp, AiOutlineComment, AiOutlineHeart } from "react-icons/ai";
import { AppContext } from "../../context/provider";
import { getFollowingPost } from "../../API";
import { ColorList } from "../Header";
import { descriptionAndHashtag } from "../../utils";

const Following = () => {
    const [posts, setPosts] = useState<any[]>([]);
    const [pos, setPos] = useState(0);
    const { state, dispatch } = useContext(AppContext);

    useEffect(() => {
        getFollowingPost(state.accessToken, state.userId).then(res => setPosts(res.data));
    }, [state.accessToken, state.userId]);
    
    return <>
        <Row className="w-11/12 flex items-center justify-center">
            {posts.length !== 0 ?
                <Row className="py-10" style={{ height: "700px", width: "500px" }}>
                    <Row className="w-full h-fit">
                        <Col span={19}>
                            <Row className="w-full">
                                <Col span={6}>
                                    <Avatar className="flex items-center justify-center" style={{ fontFamily: "Signika", width: "70px", height: "70px", backgroundColor: ColorList[posts[pos].user.id % 4], verticalAlign: 'middle' }}>
                                        {posts[pos].user.name[0]}
                                    </Avatar>
                                </Col>
                                <Col span={18}>
                                    <Row className="w-full">
                                        <Button className="m-0 p-0 border-none text-lg" style={{ fontFamily: "Signika", lineHeight: "26px" }}>
                                            {posts[pos].user.name}
                                        </Button>
                                    </Row>
                                    <Row className="w-full flex flex-wrap">
                                        <p className="w-full text-base text-ellipsis overflow-hidden whitespace-nowrap" 
                                            style={{ fontFamily: "Signika", fontWeight: 300 }}
                                        >
                                            {
                                                descriptionAndHashtag(posts[pos].description).description.length === 0 ? "No description"
                                                    : descriptionAndHashtag(posts[pos].description).description.join(' ')
                                            }
                                        </p>
                                    </Row>
                                    <Row className="w-full flex flex-wrap">
                                        <p className="w-full text-base text-ellipsis overflow-hidden whitespace-nowrap"
                                            style={{ fontFamily: "Signika", fontWeight: 300, color: "#2c78dc" }}
                                        >
                                            {
                                                descriptionAndHashtag(posts[pos].description).hashtag.length === 0 ? "No hastag"
                                                    : descriptionAndHashtag(posts[pos].description).hashtag.join(' ')
                                            }
                                        </p>
                                    </Row>
                                </Col>
                            </Row>
                        </Col>
                        <Col offset={1} span={4} className="flex justify-end">
                            <Button className="w-20" style={{ fontFamily: "Signika", color: "red" }}>
                                Unfollow
                            </Button>
                        </Col>
                    </Row>
                    <Row className="w-full flex justify-center items-center relative py-2" style={{ height: "580px" }}>
                        <Row className="w-2/3 bg-black h-full rounded-lg">
                            <Button className='w-full h-full m-0 p-0'>
                                <video className='w-full h-full rounded-lg' controls>
                                    <source src={"https://drive.google.com/uc?export=download&id=" + posts[pos].driveId} type="video/mp4" />
                                </video>
                            </Button>
                        </Row>

                        <Row className="w-10 h-fit absolute right-7">
                            <Button onClick={() => setPos(pos-1)} disabled={pos === 0}
                                className="m-0 p-0 border-none rounded-full w-10 h-10"
                            >
                                <Row className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                                    <AiFillCaretUp size={20} />
                                </Row>
                            </Button>

                            <Button onClick={() => setPos(pos - 1)} disabled={pos === posts.length-1}
                                className="m-0 p-0 mt-3 border-none rounded-full w-10 h-10"
                            >
                                <Row className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                                    <AiFillCaretDown size={20} />
                                </Row>
                            </Button>
                        </Row>

                        <Row className="w-10 h-fit absolute bottom-7 right-7">
                            <Button className="m-0 p-0 border-none rounded-full w-10 h-10">
                                <Row className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                                    <AiOutlineHeart size={20} />
                                </Row>
                            </Button>

                            <Row className="w-full flex items-center justify-center text-lg" style={{ fontFamily: "Signika" }}>
                                0
                            </Row>

                            <Button  className="m-0 p-0 mt-2 border-none rounded-full w-10 h-10">
                                <Row className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                                    <AiOutlineComment size={20} />
                                </Row>
                            </Button>
                        </Row>
                    </Row>
                </Row> : 
                <Row>You haven't followed anyone yet</Row>
            }
        </Row>
    </>
}

export default Following;