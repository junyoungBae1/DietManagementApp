const Recipe = require('../models/recipe');

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