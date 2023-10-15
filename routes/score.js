var express = require('express');
const router = express.Router();

const scoreController = require("../controllers/score");

router.post('/updateScore', scoreController.updateScore);

// router.post('/updateScore', async (req,res) =>{
//     const email = req.body.email;
//     const score = req.body.score;
    
//     try {
//       // 이메일로 사용자 찾기
//       const user = await User.findOne({ email });
      
//       if (!user) {
//         // 사용자가 존재하지 않으면 에러 메시지 반환
//         return res.send("<script> alert('사용자가 존재하지 않습니다.'); location.href='/';</script>");
//       }
      
//       // 사용자의 점수 업데이트
//       user.score += score;
//       await user.save();
      
//       console.log('점수가 업데이트되었습니다.');
//       res.send("<script> alert('점수가 업데이트되었습니다.'); location.href='/score';</script>");
//     } catch(err) {
//       console.log(err);
//       res.send("<script> alert('점수 업데이트에 실패했습니다.'); location.href='/score';</script>");
//     }
//   });
router.get('/getScore', scoreController.getScore);
// router.get('/getScore', async (req, res) => {
//     try {
//         const scores = await User.find().sort({ score: -1 }); // 점수별로 내림차순 정렬하여 가져옴
//         res.json(scores);
//     } catch (err) {
//         console.error(err);
//         res.status(500).send("서버 에러");
//     }
// });

module.exports = router;