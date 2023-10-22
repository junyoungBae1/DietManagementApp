const Notice = require('../models/noticeBoard');
const User = require('../models/user');
var randomString = require("randomstring");
var moment = require('moment');
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");

// 게시물 생성
module.exports.create = async (req, res) => {
    var date = moment().format('YYYY-MM-DD HH:mm:ss');
    const { title, content, writer, userEmail } = req.body;
    const newNotice = new Notice({
      noticeToken: randomString.generate(12),
      title: title,
      content: content,
      writer: writer,
      userEmail: userEmail,
      createdAt: date,
    });

    try {
      await newNotice.save();
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
      return res.status(200).json({ data: list })
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'read Server Error' });
    }
};

// 특정 게시물 조회
module.exports.getBoard = async(req,res) => {
    const {noticetoken, userEmail} = req.body;
    const notice = await Notice.findOne({noticeToken: noticetoken})
    if (notice) {
			let matchResult = 0;
      if (notice.userEmail === userEmail) { 
        matchResult = 1;
      }
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