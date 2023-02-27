const Diary = require('../models/Diary.model');
const Profile = require('../models/Profile.model');
const Weight = require('../models/Weight.model');
const axios = require('axios');


//DIARY CONTROLLER
module.exports.dashboard = (req, res, next) => {
    const currentUserId = req.user.id;
    const date = new Date().toISOString().split('T')[0];

    Diary.findOne({$and: [{ date: date }, { user: currentUserId }]})
    .then(finalDiary => {
        Profile.findOne({ user: currentUserId })
        .then(profile => {
            profile.recommendedCarbohydrate = (Math.round(profile.recommendedCarbohydrate * 100) / 100).toFixed(2);
            profile.recommendedProtein = (Math.round(profile.recommendedProtein * 100) / 100).toFixed(2);
            profile.recommendedFat = (Math.round(profile.recommendedFat * 100) / 100).toFixed(2);
            Weight.findOne({ user: currentUserId }).sort({ _id: -1 })
            .then(weight => {
                res.render('user/dashboard', { finalDiary, profile, weight })
            })
            .catch(err => next(err))
        })
        .catch(err => next(err))
    })
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
                calories: caloriesToAdd.toFixed(2),
                proteins: proteinsToAdd.toFixed(2),
                fats: fatToAdd.toFixed(2),
                carbohydrates: carbsToAdd.toFixed(2),
                fibers: fiberToAdd.toFixed(2),
                date: date
            })
        } else {
            return Diary.findByIdAndUpdate( diaryFound.id, {
                breakfast: diaryMealTime === 'breakfast' ? [...diaryFound.breakfast, ingredientTotalInfo] : [...diaryFound.breakfast],
                lunch: diaryMealTime === 'lunch' ? [...diaryFound.lunch, ingredientTotalInfo] : [...diaryFound.lunch],
                dinner: diaryMealTime === 'dinner' ? [...diaryFound.dinner, ingredientTotalInfo] : [...diaryFound.dinner],
                other: diaryMealTime === 'other' ? [...diaryFound.other, ingredientTotalInfo] : [...diaryFound.other],
                calories: (diaryFound.calories += caloriesToAdd).toFixed(2),
                proteins: (diaryFound.proteins += proteinsToAdd).toFixed(2),
                fats: (diaryFound.fats += fatToAdd).toFixed(2),
                carbohydrates: (diaryFound.carbohydrates += carbsToAdd).toFixed(2),
                fibers: (diaryFound.fibers += fiberToAdd).toFixed(2),
            })
        }
    })
    .then(finalDiary => res.send('hola'))
    .catch(err => next(err))
}

module.exports.deleteIngredient = (req, res, next) => {
    const currentUserId = req.user.id;
    const date = new Date().toISOString().split('T')[0];
    let thisName = req.params.name.split('-')[0];
    let thisHour = req.params.name.split('-')[1];
    let diaryToUpdate;
    let caloriesToDelete, fatToDelete, fiberToDelete, proteinToDelete, carbsToDelete;

    Diary.findOne(   { $and: [{ date: date }, { user: currentUserId }] })
    .then(found => {
        diaryToUpdate = found;
        let ingredientDeleted;

        if(thisHour === 'breakfast') {
            ingredientDeleted = diaryToUpdate.breakfast.filter(x => x.name === thisName);
        } else if(thisHour === 'lunch') {
            ingredientDeleted = diaryToUpdate.lunch.filter(x => x.name === thisName);
        } else if(thisHour === 'dinner') {
            ingredientDeleted = diaryToUpdate.dinner.filter(x => x.name === thisName);
        } else {
            ingredientDeleted = diaryToUpdate.other.filter(x => x.name === thisName);
        }

        ingredientDeleted[0].nutrition.map(x => {
            if(x.name === 'Calories') {
                caloriesToDelete = x.amount
            } else if (x.name === 'Protein') {
                proteinToDelete = x.amount
            } else if (x.name === 'Fat') {
                fatToDelete = x.amount
            } else if (x.name === 'Carbohydrates') {
                carbsToDelete = x.amount
            } else if (x.name === 'Fiber') {
                fiberToDelete = x.amount
            }
        })

        return Diary.findByIdAndUpdate( diaryToUpdate.id, {
            calories: (diaryToUpdate.calories -= caloriesToDelete).toFixed(2) <= 0 ? 0 : (diaryToUpdate.calories -= caloriesToDelete).toFixed(2),
            proteins: (diaryToUpdate.proteins -= proteinToDelete).toFixed(2) <= 0 ? 0 : (diaryToUpdate.proteins -= proteinToDelete).toFixed(2),
            fats: (diaryToUpdate.fats -= fatToDelete).toFixed(2) <= 0 ? 0 : (diaryToUpdate.fats -= fatToDelete).toFixed(2),
            carbohydrates: (diaryToUpdate.carbohydrates -= carbsToDelete).toFixed(2) <= 0 ? 0 : (diaryToUpdate.carbohydrates -= carbsToDelete).toFixed(2),
            fibers: (diaryToUpdate.fibers -= fiberToDelete).toFixed(2) <= 0 ? 0 : (diaryToUpdate.fibers -= fiberToDelete).toFixed(2),
            breakfast: thisHour === 'breakfast' ? diaryToUpdate.breakfast?.filter(x => x.name !== thisName) : [...diaryToUpdate.breakfast],
            lunch: thisHour === 'lunch' ? diaryToUpdate.lunch?.filter(x => x.name !== thisName) : [...diaryToUpdate.lunch],
            dinner: thisHour === 'dinner' ? diaryToUpdate.dinner?.filter(x => x.name !== thisName) : [...diaryToUpdate.dinner],
            other: thisHour === 'other' ? diaryToUpdate.other?.filter(x => x.name !== thisName) : [...diaryToUpdate.other],
        })
    })
    .then((updated) => res.send('OK'))
    .catch(err => console.log(err))
}

//WEIGHT CONTROLLER
module.exports.createWeight = (req, res, next) => {
    const { weight } = req.body;
    const date = new Date().toISOString().split('T')[0];
    const currentUserId = req.user.id;
    let IMC;

    Profile.findOne({ user: currentUserId })
    .then(profile => {
        IMC = weight / (profile.height * profile.height) * 10000;
        return Weight.findOne({$and: [{ date: date }, { user: currentUserId }]})
    })
    .then(weightFound => {
        if(weightFound) {
            return Weight.findByIdAndUpdate(weightFound.id, { weight, IMC })
        } else {
            return Weight.create({
                user: currentUserId,
                date,
                weight,
                IMC
            })
        }
    })
    .then(response => {
        res.status(201).send('OK')
    })
    .catch(err => next(err))
}