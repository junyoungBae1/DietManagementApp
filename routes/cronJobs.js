const cron = require('node-cron');
const User = require('../models/user');
const Image = require('../models/image');
var moment = require('moment-timezone');

cron.schedule('0 1 0 * * *', async () => {
    try {
        console.log("점수 전체 업데이트를 시작합니다...");
        const today = moment().tz('Asia/Seoul').startOf('day');
        const yesterday = moment().tz('Asia/Seoul').subtract(1, 'day').startOf('day');
        
        const formattedToday = today.format("YYYY-MM-DD HH:mm:ss");
        const formattedYesterday = yesterday.format("YYYY-MM-DD HH:mm:ss");
        const users = await User.find({});
        console.log("a")
        for (let user of users) {
            const images = await Image.find({ email: user.email, date: { $gte: formattedYesterday, $lt: formattedToday } });
            // 이미지가 없는 경우에는 점수를 부여하지 않음
            if (images.length === 0) {
                continue;
            }

            const mealTypes = ["0","1","2","3"];
            for (let type of mealTypes){
                const image = images.find(img => img.etc === type);
                if (!image) {
                    // 이미지가 없으면 점수 100점 부여
                    
                    const score = type === "0" ? 25 : 100
                    user.score += Number(score);
                    await user.save();
                }
            }
        }
        console.log("점수 업데이트 끝났습니다..")

    } catch(err) {
        console.log(err);
    }
});