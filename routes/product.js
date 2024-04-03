const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const { isLogedIn, validateProduct, isseller, isValidProductAuthor } = require('../middleware');

router.get('/products', async (req, res) => {
    
    try {
        const products = await Product.find({});
        res.render('products/index', { products });
    }
    catch (e) {
        res.status(500).render('error',{err:e.message})
    }
});
router.get('/', async (req, res) => {
    
    try {
        res.render('home');
    }
    catch (e) {
        res.status(500).render('error',{err:e.message})
    }
});


router.get('/products/new',isLogedIn ,isseller, (req, res) => {
    
    try {
        res.render('products/new');
    }
    catch (e) {
         res.status(500).render('error',{err:e.message})
    }  
});

router.post('/products',isLogedIn, isseller,validateProduct,async (req, res) => {
    
    try {
        const { name, img, desc, price } = req.body;
        const author = req.user._id;
        await Product.create({ name, img, price: parseFloat(price), desc ,author});
        req.flash('success', 'Successfully added a new product!');
        res.redirect('/products');
    }
    catch (e) {
        res.status(500).render('error', { err: e.message })
    }
});

router.get('/products/:id', async (req, res) => {


    try {
        const { id } = req.params;
        const product = await Product.findById(id).populate('reviews');
        // console.log(product);
        res.render('products/show', { product}); 
    }
    catch (e) {
        res.status(500).render('error',{err:e.message})
    }
});


router.get('/products/:id/edit',isLogedIn, isValidProductAuthor, async (req, res) => {
    
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        res.render('products/edit', { product });
    }
    catch (e) {
        res.status(500).render('error',{err:e.message})
    }  
});

router.patch('/products/:id',isLogedIn,validateProduct,async (req, res) => {
    

    try {
        const { id } = req.params;
        const { name, price, img, desc } = req.body;
        await Product.findByIdAndUpdate(id, { name, price, desc, img });
        req.flash('success', 'Edit Your Product Successfully');
        res.redirect(`/products/${id}`);
    }
    catch (e) {
        res.status(500).render('error',{err:e.message})
        
    } 
});


router.delete('/products/:id',isLogedIn, isValidProductAuthor, async (req, res) => {
    
    try {
        const { id } = req.params;
        await Product.findByIdAndDelete(id);
        res.redirect('/products');
    }
    catch (e) {
        res.status(500).render('error',{err:e.message})   
    }
});




module.exports = router;