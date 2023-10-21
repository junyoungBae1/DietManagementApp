const Notice = require('../models/noticeBoard');

// 게시물 생성
module.exports.create = async (req, res) => {
    const { title, content, author } = req.body;
  
    try {
      const newNotice = new Notice({
        title,
        content,
        author,
        createdAt: Date.now(),
      });
  
      await newNotice.save();
      res.status(200).json({ message: 'Success' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server Error' });
    }
};
  
// 모든 게시물 조회
module.exports.read = async (req, res) => {
    try {
      const notices = await Notice.find();
      res.status(200).json({ message: 'Success' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server Error' });
    }
};
//게시물 수정
module.exports.update = async (req, res) => {
    const { title, content, id } = req.body;
  
    try {
      const noticeToUpdate = await Notice.findById(id);
  
      if (!noticeToUpdate) {
        return res.status(404).json({ message: 'Notice not found' });
      }
  
     noticeToUpdate.title = title;
     noticeToUpdate.content = content;
     await noticeToUpdate.save();
  
     res.json(noticeToUpdate);
   } catch (err) {
     console.error(err);
     res.status(500).json({ message : 'Server Error' });
   }
};
  
// 게시물 삭제
module.exports.delete = async (req, res) => {
    const { id }= req.body;
  
    try{
       await Notice.findByIdAndDelete(id);
  
       // 성공적으로 삭제되었을 때 응답
       return res.json({ message: 'Successfully deleted' });
     } catch(err){
         console.error(err);
         returnres.status(500).json({message:'Server Error'});
     }
};