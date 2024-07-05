/*import { Router } from "express";

const router = Router();

const users = [
    { id: 1, name: 'Taylor Swift' },
    { id: 2, name: 'Katy Perry' }
];

router.get('/', (req, res) => {
    res.render('Home');
});

router.get('/users', (req, res) => {
    res.render('Users', { users });
});

router.get('/users/:uid', (req, res) => {
    const uid = req.params.uid;
    const userId = parseInt(uid);
    const user = users.find(u => u.id === userId);

    if (!user) {
        return res.render('404', {
            entity: 'Usuario'
        });
    }

    res.render('UserDetails', { user });
});

export default router;*/

import { Router } from 'express';
import { productsService } from '../managers/index.js';

const router = Router();

router.get('/Home', async (req, res) => {
  const products = await productsService.getProducts();
  res.render('Home', { products });
});

router.get('/Realtimeproducts', async (req, res) => {
  const products = await productsService.getProducts();
  res.render('RealTimeProducts', { products });
});

router.get('/:pid',async(req,res)=>{
  const product = await productsService.getProductById(req.params.pid);
  if(!product){
    return res.render('404');
  }
  res.render('ProductDetails',{
    product,
    mainImage:product.thumbnails.find(thumbnail=>thumbnail.main)
  });
})

export default router;