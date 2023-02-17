const Diary = require('../models/Diary.model');
const axios = require('axios');

//DIARY CONTROLLER
module.exports.dashboard = (req, res, next) => {
    res.render('user/dashboard')
}

module.exports.addIngredient = (req, res, next) => {
    const { idOfIngredient, diaryAmount, diaryMealTime, diaryUnit } = req.body;
    const date = new Date().toISOString().split('T')[0];
    const currentUserId = req.user.id;
    let ingredientTotalInfo;

    axios.get(`${process.env.SPOONACULAR_URL}/food/ingredients/${idOfIngredient}/information?apiKey=${process.env.SPOONACULAR_KEY}&amount=${diaryAmount}&unit=${diaryUnit}`)
    .then(info => {
        ingredientTotalInfo = info.data
        return Diary.findOne({$and: [{ date: date }, { user: currentUserId }]})
    })
    .then(diaryFound => {
        if(!diaryFound) {
            Diary.create({
                user: currentUserId,
                //breakfast: diaryMealTime === 'breakfast' ? [{ id: idOfIngredient, name: ingredientTotalInfo.name }] : [],
                //lunch
                //dinner
                //other
                //calories vai ser:  o que vier de caloria no ingredientTotalInfo
                //proteins
                //fats
                //carbs
                date: date
            })
        }
    })
    .catch(err => next(err))
}

