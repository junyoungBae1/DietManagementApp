const Recipe = require('../models/recipe');
const Image = require('../models/image')
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
        const images = await Image.find({email: email})
        console.log(email)
        let foodnames = images.map(image => image.foodnames).reduce((acc, val) => acc.concat(val), []);
        
        if (images.length === 0) {
            return res.json({
                success: false,
                message: "해당 이메일에 맞는 이미지가 없습니다!",
            });
        } else {
            return res.json({
                images_data_count : images.length,
                images_foodnames : foodnames,
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