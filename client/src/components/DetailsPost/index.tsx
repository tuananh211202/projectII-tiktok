import { Avatar, Button, Col, Input, Modal, Row, message } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/provider";
import { createComment, getAllComment, getAllReact, getPostByPostId } from "../../API";
import { ColorList } from "../Header";
import { useNavigate, useParams } from "react-router-dom";
import { MdCancel } from "react-icons/md";
import { AiFillHeart, AiOutlineEye } from "react-icons/ai";
import { socket } from "../Chat";

const DetailsPost = () => {
    const { id: postId } = useParams<string>();
    const { state, dispatch } = useContext(AppContext);
    const [cmt, setCmt] = useState("");
    const [comments, setComments] = useState<any[]>([]);
    const [reacts, setReacts] = useState<string[]>([]);
    const navigate = useNavigate();

    const [post, setPost] = useState({
        id: 0,
        description: "",
        driveId: "",
        cost: 0,
        react: 0,
        permission: "",
        user: {
            id: 0,
            name: ""
        }
    })

    useEffect(() => {
        getPostByPostId(state.accessToken, parseInt(postId ?? '0')).then(res => setPost(res.data[0]))
        .catch((err) => {
            console.log(err);
        });

        getAllComment(state.accessToken, parseInt(postId ?? '0')).then(res => setComments(res.data))
        .catch((err) => {
            console.log(err);
        });

        getAllReact(state.accessToken, parseInt(postId ?? '0')).then(res => setReacts(res.data))
        .catch((err) => {
            console.log(err);
        });
    }, [state.accessToken, postId]);

    useEffect(() => {
        socket.on('recCR', cmt => {
            if (cmt.id === parseInt(postId ?? '0')){
                getAllComment(state.accessToken, parseInt(postId ?? '0')).then(res => setComments(res.data))
                .catch((err) => {
                    console.log(err);
                });
                getAllReact(state.accessToken, parseInt(postId ?? '0')).then(res => setReacts(res.data))
                .catch((err) => {
                    console.log(err);
                });
            }
        })
    }, [comments, reacts]);

    const handleCmt = () => {
        if(cmt !== ""){
            socket.emit("commentAndReact", {
                description: cmt,
                postId: parseInt(postId ?? '0'),
                userId: state.userId
            });
        }
        setCmt("");
    }

    const handleReact = () => {
        if(reacts.includes("" + state.userId)){
            socket.emit("commentAndReact", {
                type: "delete",
                postId: parseInt(postId ?? '0'),
                userId: state.userId
            });
        } else {
            socket.emit("commentAndReact", {
                description: "",
                postId: parseInt(postId ?? '0'),
                userId: state.userId
            });
        }
    }

    return <>
        {
            post.id === 0 ? null :
            <Row className="bg-white fixed top-0 left-0 w-screen h-screen px-20">
                <Col span={15} className="bg-black h-full border-solid border-x-2 relative">
                    <video className='w-full h-full rounded-lg' controls>
                        <source src={"https://drive.google.com/uc?export=download&id=" + post.driveId} type="video/mp4" />
                    </video>
                    <Button 
                        type="link" onClick={() => navigate(-1)}
                        className="rounded-full absolute top-3 left-3 p-0 m-0"
                    >
                        <MdCancel size={30} />
                    </Button>
                    <Button
                        type="link"
                        className="rounded-full absolute top-3 right-3 p-0 m-0"
                        onClick={handleReact}
                    >
                        <AiFillHeart color={reacts.includes("" + state.userId) ? "#B22222" : "white"} size={30} />
                    </Button>
                    <Row className="absolute top-3 right-11 text-white text-2xl" style={{ fontFamily: "Signika" }}>
                        {reacts.length}
                    </Row>
                </Col>
                <Col span={9} className="bg-slate-50 h-full border-solid border-t-2 border-r-2 relative flex justify-center">
                    <Row className="w-11/12 inline-block" style={{ height: "90%" }}>
                        <Row 
                            className="w-full h-fit text-xl rounded-xl bg-slate-200 flex items-center p-2 mt-5"
                            style={{ fontFamily: "Signika" }}
                        >
                            <Avatar className="m-2" style={{ backgroundColor: ColorList[post.user.id % 4] }}>
                                {post.user.name[0]} 
                            </Avatar>
                            {post.user.name}
                            <Row 
                                className="w-full px-3" 
                                style={{ fontFamily: "Signika", fontWeight: 300 }}
                            >
                                {post.description}
                            </Row>
                        </Row>
                        <Row className="p-2 text-base" style={{ fontFamily: "Signika" }}>
                            Comments({comments.length})
                        </Row>
                        {
                            comments.map(comment => <>
                                <Row className="pl-3 py-2">
                                    <Col span={2}>
                                        <Avatar style={{ backgroundColor: ColorList[comment.user.id % 4] }}>
                                            {comment.user.name[0]}                                        
                                        </Avatar>
                                    </Col>
                                    <Col span={21}>
                                        <Row className="w-full" style={{ fontFamily: "Signika", fontWeight: 500 }}>{comment.user.name}</Row>
                                        <Row className="w-full" style={{ fontFamily: "Signika", fontWeight: 300 }}>
                                            {comment.description}
                                        </Row>
                                    </Col>
                                    <Col span={1} className="flex justify-end">
                                        <Button type="link" className="p-0 m-0" onClick={() => navigate("/profile/" + comment.user.id)}>
                                            <AiOutlineEye />
                                        </Button>
                                    </Col>
                                </Row>
                            </>)
                        }
                    </Row>                
                    <Row className="w-full absolute bottom-0 flex items-center justify-between border-solid border-t-2 px-2" style={{ height: "10%" }}>
                        <Col span={20}>
                            <Input style={{ fontFamily: "Signika" }} onPressEnter={handleCmt} value={cmt} onChange={(e) => setCmt(e.target.value)} />
                        </Col>
                        <Col span={4} className="flex items-center justify-end">
                            <Button style={{ fontFamily: "Signika", backgroundColor: "blue", color: "white" }} onClick={handleCmt}>
                                Post
                            </Button>
                        </Col>
                    </Row>
                </Col>
            </Row>
        }
    </>;
}

export default DetailsPost;