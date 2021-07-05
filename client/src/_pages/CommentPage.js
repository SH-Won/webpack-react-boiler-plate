import React,{useState,useEffect} from 'react'
import {useSelector,useDispatch} from 'react-redux';
import CommentForm from '../components/Comment/CommentForm';
import RootComment from '../components/Comment/RootComment';

import {getComments, saveComment} from '../_actions/comment_actions';
import '../styles/CommentPage.css';
import ReplyComment from '../components/Comment/ReplyComment';
const CommentPage = ({match}) => {
    const dispatch = useDispatch();
    const {userData} = useSelector(state=>state.user);
    const {commentList} =useSelector(state => state.comment);
    const postId = match.params.postId;
    const [commentValue,setCommentValue] = useState('');
    const handleChangeComment = (e)=>{
        setCommentValue(e.target.value);
    }
    const onSubmitComment = (e) =>{
        e.preventDefault();
        let variable ={
            postId,
            value:commentValue,
            writer:userData._id
        }
        dispatch(saveComment(variable))
        setCommentValue('');

    }
    useEffect(()=>{
        dispatch(getComments(postId))
        

    },[])
    

    let commentProps = {
        value:commentValue,
        onChange:handleChangeComment,
        click:onSubmitComment
    }

    const renderCommentList = 
        commentList.map(comment => (
            !comment.reply &&
            <div key={comment._id} >
            <RootComment comment={comment} userData={userData} postId={postId}/>
            <ReplyComment  parentCommentId={comment._id} postId={postId} />
            </div>
        ))
    


    return (
        <div>
            <CommentForm {...commentProps}/>
            <div className="comment-wrap">
            {renderCommentList}
            </div>
            
            
        </div>
    )
}

export default CommentPage
