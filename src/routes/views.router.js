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