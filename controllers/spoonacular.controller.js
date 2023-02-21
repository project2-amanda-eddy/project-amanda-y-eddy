const axios = require('axios');
// const { Module } = require('module');


//RECIPES CONTROLERS
module.exports.recipes = (req, res, next) => {
    axios.get(`${process.env.SPOONACULAR_URL}/recipes/random?number=10&apiKey=${process.env.SPOONACULAR_KEY}`)
    .then((info) => {
        const recipes = info.data.recipes
        res.render('recipes/recipes', { recipes })
    })
    .catch(err => next(err))
}

module.exports.recipeDetail = (req, res, next) => {
    const { id } = req.params;
    
    axios.get(`${process.env.SPOONACULAR_URL}/recipes/${id}/information?apiKey=${process.env.SPOONACULAR_KEY}`)
    .then((info) => {
        const recipe = info.data
        res.render('recipes/detail', { recipe })
    })
    .catch(err => next(err))
}

module.exports.dietRecipes = (req, res, next) => {
    const { diet } = req.params;
    const random = Math.floor(Math.random() * 50);

    axios.get(`${process.env.SPOONACULAR_URL}/recipes/complexSearch?diet=${diet}&offset=${random}&apiKey=${process.env.SPOONACULAR_KEY}`)
    .then((info) => {
        const recipes = info.data.results
        res.render('recipes/dietRecipes', { recipes, diet })
    })
    .catch(err => next(err))
}


//FOODS CONTROLERS
module.exports.ingredients = (req, res, next) => {
    res.render('ingredients/ingredients')
}

module.exports.ingredientsDetail = (req, res, next) => {
    const id = req.params.id;

    axios.get(`${process.env.SPOONACULAR_URL}/food/ingredients/${id}/information?apiKey=${process.env.SPOONACULAR_KEY}`)
    .then((infoFood) => {
        const ingredient = infoFood.data
        res.render('ingredients/ingredientsDetails', { ingredient })
    })
    .catch(err => next(err))
}
