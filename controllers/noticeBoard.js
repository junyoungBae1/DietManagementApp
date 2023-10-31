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
    if (notice) {
			let matchResult = 0;
      if (String(notice.userEmail) == String(userEmail)) { 
        matchResult = 1;
      }
      console.log(String(notice.userEmail), String(userEmail), matchResult);
      return res.status(200).json({ data: { ...notice._doc, matchResult } });
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
      const noticeToDelete = await Notice.findOne({noticeToken: noticetoken});
      console.log("삭제 ",noticeToDelete)
      if (!noticeToDelete) {
        return res.status(404).json({ message: 'Notice not found' });
      }
      await noticeToDelete.remove();
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

//댓글?