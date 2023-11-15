const Image = require('../models/image');
const User = require('../models/user');
const Info = require('../models/info')
var moment = require('moment-timezone');


module.exports.saveimage = async (req, res) => {
    let {email,foodname,totalEmission,etc} = req.body;
    console.log(req.body);
    
    if(!email || !etc){
        console.log("email이나 etc가 null입니다..")
        return res.status(400).json({
        success: false,
        message: "email이나 etc가 null입니다.."
    });
    }
    console.log(email,foodname,totalEmission,etc)
    //배열 변환
    try {
        totalEmission = JSON.parse(totalEmission).map(Number);
        foodname = JSON.parse(foodname).map(String);
    } catch(err) {
        console.log('JSON 형식으로 배열 번환 실패..',err);
        return res.status(400).json(err
            //success: false,
            //message: 'JSON 형식으로 배열 번환 실패..'
        );
    }

    // 배열 크기 체크
    console.log(foodname,totalEmission)
    if(foodname.length !== totalEmission.length) {
        console.log("foodname과 totalEmission의 배열 크기가 맞지 않습니다!");
        return res.status(400).json({
            success: false,
            message: "foodname과 totalEmission의 배열 크기가 맞지 않습니다!"
        });
    }

    let foodnames = [];


    for(let i=0; i<foodname.length; i++) {
        // totalemission[i]이 number 형식인지 체크
        if(typeof totalEmission[i] !== 'number') {
            console.log(`Invalid total emission value: ${totalEmission[i]}`);
            return res.status(400).json({
                success: false,
                message: `Invalid total emission value: ${totalEmission[i]}`
            });
        }
        foodnames.push({
            foodname: foodname[i],
            totalEmission: totalEmission[i]
        });
    }

    var postDate = moment.tz("Asia/Seoul").format("YYYY-MM-DD HH:mm:ss");
    var today = moment(postDate).format("YYYY-MM-DD");
    const image = new Image({
        email : email,
        img:{
        data:req.file ? req.file.buffer : null,
        contentType:req.file ? req.file.mimetype : null,
        },
        etc : etc,
        foodnames : foodnames,
        date : postDate,
        });

    await image.save();
    
    //Info DB에서 해당 이메일 찾기
    let info = await Info.findOne({ email: email });
    //해당 이메일이 없으면 새로 생성
    if (!info) {
        info = new Info({
            email: email,
            dates: [{
                date: today,
                Breakfast: 0,
                Lunch: 0,
                Dinner: 0,
                totalEmission: 0,
                score: {
                    Dessert: 0,
                    Breakfast: 0,
                    Lunch: 0,
                    Dinner: 0
                }
            }]
        });
        await info.save();
    }
    //Info DB에서 해당 이메일 다시 찾기
    info = await Info.findOne({ email: email });
    //Info DB에서 해당 날짜 다시 찾기
    dateEmission = info.dates.find(de => de.date === today);
    //Info DB 탄소배출량 추가
    const mealTypes = ['Dessert','Breakfast', 'Lunch', 'Dinner'];
    for (const food of foodnames) {
        let mealType = mealTypes[etc];
        dateEmission[mealType] += food.totalEmission;
        dateEmission.totalEmission += food.totalEmission;
    }
    // 탄소배출량에 기반한 점수 재계산
    dateEmission.score[mealTypes[etc]] = await calScore(dateEmission[mealTypes[etc]], etc);
    // DB에 저장
    await info.save();


    if(!req.file){
        console.log("탄소배출량 save 성공!");
    // res.send("success");
        res.status(200).send("탄소배출량 save 성공!");
    }
    else{
        console.log("Image save 성공!");
    // res.send("success");
        res.status(200).send("Image save 성공!");
    }
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
    let targetDate = moment.tz(date,"Asia/Seoul");

    // 그 날의 시작 시간과 종료 시간
    let startOfDay = targetDate.clone().startOf('day').format("YYYY-MM-DD HH:mm:ss");
    let endOfDay = targetDate.clone().endOf('day').format("YYYY-MM-DD HH:mm:ss");

    const fimages = await Image.find({email:email, date: { $gte: startOfDay, $lte: endOfDay } });
    let totalEmission = Array(4).fill(0)
    
    if (fimages.length === 0) {
        console.log("해당 날짜에 맞는 파일이 없습니다!");
        return res.json({
            success: false,
            message: "해당 날짜에 맞는 파일이 없습니다!",
        });
     } else {
         console.log("파일 찾기 성공!");
         console.log(date);

        const imagesData = fimages.map(fimage => {
            fimage.foodnames.forEach(food => {
                totalEmission[fimage.etc] += food.totalEmission;
            });
            return {
                image_data: (fimage.img.data === null) ? null : fimage.img.data.toString('base64'),
                image_foods: fimage.foodnames,
                image_date: fimage.date,
                image_etc: fimage.etc
            };
        });
        // Info DB에서 해당 이메일 찾기
        let info = await Info.findOne({ email: email });
        // 해당 날짜 찾기
        let dateEmission = info.dates.find(de => de.date === date);
        // score가져오기
        let score = [
            dateEmission.score.Dessert,
            dateEmission.score.Breakfast,
            dateEmission.score.Lunch,
            dateEmission.score.Dinner
        ]

         return res.json({
             success: true,
             message: "파일 찾기 성공!",
             images_data_count : imagesData.length,
             images_data : imagesData,
             score: score,
             totalEmission: totalEmission
       });
   }
}

module.exports.deleteimage = async (req, res, next) => {
    let date = req.body.date;
    let today = moment(req.body.date).format("YYYY-MM-DD");
    const email = req.body.email
     // let targetDate = moment.tz(date,"Asia/Seoul");

    // 그 날의 시작 시간과 종료 시간
    // let startOfDay = targetDate.clone().startOf('day').format("YYYY-MM-DD HH:mm:ss");
    // let endOfDay = targetDate.clone().endOf('day').format("YYYY-MM-DD HH:mm:ss");

    try {
        // 시작 시간과 종료 시간 사이에 생성된 모든 이미지를 찾아 삭제
        // const deletedImages = await Image.deleteMany({ date: { $gte: startOfDay, $lte: endOfDay } });
        const deletedImage = await Image.findOneAndDelete({ date: date, email: email});
        console.log(deletedImage);
        let etc = deletedImage.etc;

        if (!deletedImage) {
            console.log("해당 날짜에 맞는 파일이 없습니다!");
            return res.json({
                success: false,
                message: "해당 날짜에 맞는 파일이 없습니다!",
            });
        } else {
            console.log("파일 삭제 성공!");
            let foodnames = deletedImage.foodnames.map(item => item.foodname).join(', ');
            //Info DB에서 해당 이메일 찾기
            let info = await Info.findOne({ email: deletedImage.email });
            // 해당 날짜를 찾기
            let dateEmission = info.dates.find(de => de.date === today);
            // 탄소 배출량 빼기
            const mealTypes = ['Dessert', 'Breakfast', 'Lunch', 'Dinner'];
            console.log("date",dateEmission)
            for (const food of deletedImage.foodnames) {
                
                console.log(food,etc)
                let mealType = mealTypes[etc];
                dateEmission[mealType] -= food.totalEmission;
                dateEmission.totalEmission -= food.totalEmission;
            }
            // 탄소배출량에 기반한 점수 재계산
            dateEmission.score[mealTypes[etc]] = await calScore(dateEmission[mealTypes[etc]], etc);
            await info.save();
            // 배출량이 0이면 해당 날짜를 삭제
            if (dateEmission.totalEmission === 0) {
                await Info.updateOne(
                    { email: email }, 
                    { $unset: { dates: 1 } }
                );
            }
            info = await Info.findOne({ email: email });
            // dates 배열이 비어있으면 Info를 삭제
            if (info.dates.length === 0) {
                await Info.deleteOne({ email: email });
            } else {
                // DB에 저장
                await info.save();
            }
            return res.json({
                success: true,
                message: `${foodnames}이(가) 삭제되었습니다!`,
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

async function calScore(totalEmission,etc){
    var score = 0
    console.log(etc)
    try{
        //주식일 경우
        if(totalEmission == 0){
            return 0;
        }
        if(0 < etc && etc < 4){
            score = parseInt(Math.max(0, Math.min(100, ((2.38 - totalEmission) / (2.38 - 0.1) * 100))));
        }
        //간식일 경우
        else if(etc == 0){
            score = parseInt(Math.max(0, Math.min(25, ((2.38 - totalEmission) / (2.38 - 0.1) * 25))));
        }
        console.log('점수가 업데이트  되었습니다.');
        return score;
    }catch(err){
        console.log(err);
        res.status(500).json({
            success: false,
            message: "서버 오류",
        });
    }
}