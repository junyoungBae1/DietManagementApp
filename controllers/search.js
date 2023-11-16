const Recipe = require('../models/recipe');
const Image = require('../models/image')
const Info = require('../models/info')
module.exports.foodsearch = async (req, res, next) => {
    
    try {
        const searchQuery = req.body.q;
        const recipe = await Recipe.find({foodname: new RegExp(searchQuery)}).select('foodname -_id');

        if(recipe.length > 0){
            res.json({ success: true, foodnames: recipe.map(x => x.foodname) });
        } else {
            res.json({ success: false, message: "찾을 수 없는 음식입니다." });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "서버 오류",
        });
    }
}

module.exports.report = async (req, res, next) => {
    try {
        const email = req.body.email;
        const info = await Info.find({email: email})
        

        
        if (info.length === 0) {
            return res.json({
                success: false,
                message: "등록한 적이 없습니다.",
            });
        } else {
            return res.json({
                info_data_count : info.length,
                info : info,
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