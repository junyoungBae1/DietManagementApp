const Notice = require('../models/noticeBoard');
const User = require('../models/user');
var randomString = require("randomstring");

var moment = require('moment-timezone');

// 게시물 생성
module.exports.create = async (req, res) => {
  var postDate = moment.tz("Asia/Seoul").format("YYYY-MM-DD HH:mm:ss");
  console.log(postDate)
    const { title, content, writer, userEmail } = req.body;
    const newNotice = new Notice({
      noticeToken: randomString.generate(12),
      title: title,
      content: content,
      writer: writer,
      userEmail: userEmail,
      date: postDate,
    });

    try {
      await newNotice.save();
      console.log("create success")
      return res.status(200).json({ data: newNotice });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'create Server Error' });
    }
};
  
// 모든 게시물 조회
module.exports.read = async (req, res) => {
    try {
      const list = await Notice.find();
      console.log(list)
      return res.status(200).json({ data: list })
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'read Server Error' });
    }
};

// 특정 게시물 조회
module.exports.getBoard = async(req,res) => {
    const {noticetoken, userEmail} = req.body;
    console.log(req.body)
    const notice = await Notice.findOne({noticeToken: noticetoken})
    //게시글 작성자 확인
    if (notice) {
			let matchResult = 0;
      if (String(notice.userEmail) == String(userEmail)) { 
        matchResult = 1;
      }

    // notice를 JavaScript 객체로 변환
    const noticeObject = notice.toObject();

    // 댓글의 작성자 확인
    noticeObject.comments = noticeObject.comments.map(comment => {
        if (String(comment.userEmail) == String(userEmail)) {
            comment.isWriter = true;
        } else {
            comment.isWriter = false;
        }
        return comment;
    });
      console.log(String(notice.userEmail), String(userEmail), matchResult);
      return res.status(200).json({ data: { ...noticeObject, matchResult } });
		}
		  return res.status(404).json({ message: 'getBoard Notice Not Found' });
}
//게시물 수정
module.exports.update = async (req, res) => {
    const { title, content, noticetoken } = req.body;
  
    try {
      const noticeToUpdate = await Notice.findOne({noticeToken: noticetoken});
  
      if (!noticeToUpdate) {
        return res.status(404).json({ message: 'Notice not found' });
      }
  
      noticeToUpdate.title = title;
      noticeToUpdate.content = content;
      await noticeToUpdate.save();
  
      return res.status(200).json({ message: 'Success!' });
   }  catch (err) {
      console.error(err);
      res.status(500).json({ message : 'update Server Error' });
   }
};
  
// 게시물 삭제
module.exports.delete = async (req, res) => {
  const { noticetoken } = req.body;

  try{
    const result = await Notice.deleteOne({noticeToken: noticetoken});
    if (result.n === 0) {
      return res.status(404).json({ message: 'Notice not found' });
    }
    
    console.log("삭제 성공")
    
    // 성공적으로 삭제되었을 때 응답
    return res.json({ message: 'Successfully deleted' });
    
  }catch(err){
      console.error(err);
      return res.status(500).json({message:'Delete Server Error'});
  }
};
// 게시물 검색
module.exports.search = async (req, res) => {
  const { keyword } = req.body;

  try {
    // $options: 'i' 대소문자 무시
    const notices = await Notice.find({
      $or: [
        { title: { $regex: keyword, $options: 'i' } },
        { content: { $regex: keyword, $options: 'i' } },
      ]
    });

    if (!notices.length) {
      return res.status(404).json({ message: 'No matching notices found.' });
    }

    return res.status(200).json({ data: notices });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message : 'Server Error' });
  }
};

//댓글 생성
module.exports.createComment = async (req, res) => {
  const { noticeToken, userEmail, writer, content } = req.body;
  var postDate = moment.tz("Asia/Seoul").format("YYYY-MM-DD HH:mm:ss");
  try{
      const notice = await Notice.findOne({noticeToken: noticeToken});
      if (!notice) {
          return res.status(404).json({ message: 'Notice not found' });
      }
      console.log(notice)
      notice.comments.push({userEmail: userEmail,writer: writer, content: content, date: postDate});
      await notice.save();
  
      return res.status(200).json({ message: 'Comment created' });
  } catch(err){
      console.error(err);
      return res.status(500).json({message:'Server Error'});
  }
};
//댓글 삭제
module.exports.deleteComment = async (req, res) => {
  const { noticeToken, commentId } = req.body;

  try{
      const notice = await Notice.findOne({noticeToken: noticeToken});
      if (!notice) {
          return res.status(404).json({ message: 'Notice not found' });
      }
      
      let comment = notice.comments.id(commentId);
      console.log(comment)
      if (!comment) {
          return res.status(404).json({ message: 'Comment not found' });
      }

      notice.comments.pull(commentId);
      await notice.save();
  
      return res.status(200).json({ message: 'Comment deleted' });
  } catch(err){
      console.error(err);
      return res.status(500).json({message:'Server Error'});
  }
};
//댓글 수정
module.exports.updateComment = async (req, res) => {
  const { noticeToken, commentId, content } = req.body;

  try{
      const notice = await Notice.findOne({noticeToken: noticeToken});
      if (!notice) {
          return res.status(404).json({ message: 'Notice not found' });
      }
  
      let comment = notice.comments.id(commentId);
      if (!comment) {
          return res.status(404).json({ message: 'Comment not found' });
      }
  
      comment.content = content;
      await notice.save();
  
      return res.status(200).json({ message: 'Comment updated' });
  } catch(err){
      console.error(err);
      return res.status(500).json({message:'Server Error'});
  }
};