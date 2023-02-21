const Diary = require('../models/Diary.model');
const axios = require('axios');

//DIARY CONTROLLER
module.exports.dashboard = (req, res, next) => {
    const currentUserId = req.user.id;
    const date = new Date().toISOString().split('T')[0];

    Diary.findOne({$and: [{ date: date }, { user: currentUserId }]})
    .then(finalDiary => res.render('user/dashboard', { finalDiary }))
    .catch(err => next(err))
}

module.exports.addIngredient = (req, res, next) => {
    const { idOfIngredient, diaryAmount, diaryMealTime, diaryUnit } = req.body;
    const date = new Date().toISOString().split('T')[0];
    const currentUserId = req.user.id;
    const filteredFieldsNutrients = ['Calories', 'Protein', 'Fat', 'Carbohydrates', 'Fiber'];
    let ingredientTotalInfo;
    let caloriesToAdd, carbsToAdd, proteinsToAdd, fatToAdd, fiberToAdd;
    
    axios.get(`${process.env.SPOONACULAR_URL}/food/ingredients/${idOfIngredient}/information?apiKey=${process.env.SPOONACULAR_KEY}&amount=${diaryAmount}&unit=${diaryUnit}`)
    .then(info => {
        ingredientTotalInfo = info.data
        ingredientTotalInfo.nutrition = ingredientTotalInfo.nutrition.nutrients.filter(x => filteredFieldsNutrients.includes(x.name));
        ingredientTotalInfo.nutrition.map(x => {
            if(x.name === 'Calories') {
                caloriesToAdd = x.amount
            } else if (x.name === 'Protein') {
                proteinsToAdd = x.amount
            } else if (x.name === 'Fat') {
                fatToAdd = x.amount
            } else if (x.name === 'Carbohydrates') {
                carbsToAdd = x.amount
            } else if (x.name === 'Fiber') {
                fiberToAdd = x.amount
            }
        })
        return Diary.findOne({$and: [{ date: date }, { user: currentUserId }]})
    })
    .then(diaryFound => {
        if(!diaryFound) {
            return Diary.create({
                user: currentUserId,
                breakfast: diaryMealTime === 'breakfast' ? [ingredientTotalInfo] : [],
                lunch: diaryMealTime === 'lunch' ? [ingredientTotalInfo] : [],
                dinner: diaryMealTime === 'dinner' ? [ingredientTotalInfo] : [],
                other: diaryMealTime === 'other' ? [ingredientTotalInfo] : [],
                calories: caloriesToAdd,
                proteins: proteinsToAdd,
                fats: fatToAdd,
                carbohydrates: carbsToAdd,
                fibers: fiberToAdd,
                date: date
            })
        } else {
            return Diary.findByIdAndUpdate( diaryFound.id, {
                breakfast: diaryMealTime === 'breakfast' ? [...diaryFound.breakfast, ingredientTotalInfo] : [...diaryFound.breakfast],
                lunch: diaryMealTime === 'lunch' ? [...diaryFound.lunch, ingredientTotalInfo] : [...diaryFound.lunch],
                dinner: diaryMealTime === 'dinner' ? [...diaryFound.dinner, ingredientTotalInfo] : [...diaryFound.dinner],
                other: diaryMealTime === 'other' ? [...diaryFound.other, ingredientTotalInfo] : [...diaryFound.other],
                calories: diaryFound.calories += caloriesToAdd,
                proteins: diaryFound.proteins += proteinsToAdd,
                fats: diaryFound.fats += fatToAdd,
                carbohydrates: diaryFound.carbohydrates += carbsToAdd,
                fibers: diaryFound.fibers += fiberToAdd,
            })
        }
    })
    .then(finalDiary => res.send('hola'))
    .catch(err => next(err))
}

