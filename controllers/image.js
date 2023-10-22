const Image = require('../models/image');
const User = require('../models/user');

module.exports.saveimage = async (req, res) => {
    let {email,foodname,etc} = req.body;
    // console.log(req.body.foodname)


const image = new Image({
email : email,
img:{
data: req.file.buffer,
contentType: req.file.mimetype,
},
etc : etc,
});
await image.save();
console.log("Image save 성공!");
// res.send("success");
    res.status(200).send(req.file.buffer.toString('base64'));
}

module.exports.findimage = async (req,res,next) =>{

    if (!req.body.date) {
    return res.status(400).json({
        success: false,
        message: "'date' field 형식으로 작성해주세요!!(\"YYYY-MM-DD\")"
    });
}
    let date = req.body.date;
    let email = req.body.email;
    // Date 객체로 변환
    let targetDate = new Date(date);

    // 그 날의 시작 시간과 종료 시간
    let startOfDay = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
    let endOfDay = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate(), 23, 59, 59);

    const fimages = await Image.find({email:email, createdAt: { $gte: startOfDay, $lte: endOfDay } });

    if (fimages.length === 0) {
        console.log("해당 날짜에 맞는 파일이 없습니다!");
        return res.json({
            success: false,
            message: "해당 날짜에 맞는 파일이 없습니다!",
        });
    } else {
        console.log("파일 찾기 성공!");

        const imagesData = fimages.map(fimage => ({
            created_at: fimage.createdAt,
            image_data: fimage.img.data.toString('base64')
        }));

        return res.json({
            success: true,
            message: "파일 찾기 성공!",
            images_data_count : imagesData.length,
            images_data : imagesData
       });
    }
}

module.exports.deleteimage = async (req, res, next) => {
    let date = req.body.date;
    let targetDate = new Date(date);

    // 그 날의 시작 시간과 종료 시간
    let startOfDay = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
    let endOfDay = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate(), 23, 59, 59);

    try {
        // 시작 시간과 종료 시간 사이에 생성된 모든 이미지를 찾아 삭제
        const deletedImages = await Image.deleteMany({ createdAt: { $gte: startOfDay, $lte: endOfDay } });

        if (deletedImages.deletedCount === 0) {
            console.log("해당 날짜에 맞는 파일이 없습니다!");
            return res.json({
                success: false,
                message: "해당 날짜에 맞는 파일이 없습니다!",
            });
        } else {
            console.log("파일 삭제 성공!");
            return res.json({
                success: true,
                message: `총 ${deletedImages.deletedCount}개의 파일이 삭제되었습니다!`,
            });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "서버 오류",
        });
    }
}

async function updateScore(email,totalEmission,etc){
    var score = 0
    
    try{
        //주식일 경우
        if(etc = 1){
            score = parseInt(max(0,min(100,-log(totalEmission / 1.19 * 100))));
        }
        //간식일 경우
        else if(etc = 0){
            score = parseInt(max(0,min(25,-log(totalEmission / (1.19 * 1/4) * 100))));
        }
        const user = await User.findOne({ email });
        user.score += Number(score);
        await user.save();
        console.log('점수가 업데이트  되었습니다.');

    }catch(err){
        console.log(err);
        res.status(500).json({
            success: false,
            message: "서버 오류",
        });
    }
}