const Food = require('../models/food');
const fs = require('fs');


const deleteFile = (filePath, next) => {
    fs.unlink(filePath, (err) => {
        if (err) {
            next(err);
        }
    });
};

exports.addFood = async (req, res, next) => {
    const title = req.body.title;
    const image = req.file;
    const description = req.body.description;
    const price = req.body.price;
    const category = req.body.category;

    const imageUrl = image.path;

    const food = new Food({
        title: title,
        imageUrl: imageUrl,
        description: description,
        price: price,
        category: category,
    })
    try {
        await food.save()
        res.json({
            message: " add food success"
        })
    } catch (err) {
        if (!err) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.adminProducts = async (req, res, next) => {
    try {
        const foodData = await Food.find();
        res.json({
            message: 'fetch food data',
            data: foodData,
        })

    } catch (err) {
        if (!err) {
            err.statusCode = 500;
        }
        next();
    }
}

exports.editFood = async (req, res, next) => {
    const FoodId = req.params.Productid;
    console.log(FoodId);
    try {
        const updateTilte = req.body.title;
        const image = req.file;
        const updateDescription = req.body.description;
        const updatePrice = req.body.price;
        const updateCategory = req.body.category;
        const editProduct = await Food.findById(FoodId);
        editProduct.title = updateTilte;
        if (image) {
            deleteFile(editProduct.imageUrl);
            editProduct.imageUrl = image.path
        }
        editProduct.description = updateDescription;
        editProduct.price = updatePrice;
        editProduct.category = updateCategory;

        const data = await editProduct.save();
        res.json({
            message: 'edit successfully',
            data: data
        })

    } catch (err) {
        if (!err) {
            err.statusCode = 500;
        }
        next();
    }

}
exports.deleteProducts = async (req ,res ,next) =>{
    const productId = req.params.productId;
    console.log(productId);
    try{
        const found =  await Food.findById(productId);

        if (!found) {
            const error = new Error('Product not found');
            error.statusCode = 404;
            throw error;
        }

        deleteFile(found.imageUrl);

        await Food.findByIdAndDelete(productId);
        res.json({
            message : ' Delete Items Successfully'
        })
    }catch(err){
        if(!err){
            err.statusCode = 500;
        }
        next(err);
    }
}