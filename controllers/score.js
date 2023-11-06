const User = require('../models/user');
var moment = require('moment-timezone');

//점수 업데이트
module.exports.updateScore = async (req, res, next) => {
    const email = req.body.email;
    const score = req.body.score;
    try {
      // 이메일로 사용자 찾기
      const user = await User.findOne({ email });
      
      if (!user) {
        // 사용자가 존재하지 않으면 에러 메시지 반환
        return res.send("<script> alert('사용자가 존재하지 않습니다.'); location.href='/score';</script>");
      }
      
      // 사용자의 점수 업데이트
      user.score += Number(score);
      await user.save();
      
      console.log('점수가 업데이트되었습니다.');
      res.send("<script> alert('점수가 업데이트되었습니다.'); location.href='/score';</script>");
    } catch(err) {
      console.log(err);
      res.send("<script> alert('점수 업데이트에 실패했습니다.'); location.href='/score';</script>");
    }
};

//점수 리스트
module.exports.getScore = async (req, res, next) => {
    try {
        // 업데이트된 시간 알려주기
        var postDate = moment.tz("Asia/Seoul").format("YYYY-MM-DD HH:mm:ss");
        // 점수별로 내림차순 정렬하여 가져옴
        const scores = await User.find({}, { _id: 0, username: 1, score: 1 }).sort({ score: -1 }); 
        console.log(scores,postDate)
        res.status(200).json([scores,postDate]);
    } catch (err) {
        console.error(err);
        res.status(500).send("서버 에러");
    }
};

