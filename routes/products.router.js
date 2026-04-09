const express = require('express');
const ProductsService = require('./../services/product.service');
const validatorHandler = require('./../middlewares/validator.handler');
const upload = require('./../middlewares/upload.middleware');
const { createProductSchema, updateProductSchema, getProductSchema } = require('./../schemas/product.schema');

const router = express.Router();
const service = new ProductsService();


// Productos próximos a expirar (vendidos, imagen será borrada en 7 días)
router.get('/expirando', async (req, res, next) => {
  try {
    const { Op } = require('sequelize');
    const { models } = require('../libs/sequelize');
    
    const ahora = new Date();
    const hace7dias = new Date();
    hace7dias.setDate(hace7dias.getDate() - 7);

    // Productos con stock 0, con sold_at, imagen aún no borrada
    const productos = await models.Product.findAll({
      where: {
        stock: 0,
        sold_at: { [Op.ne]: null },
        image_deleted: false
      },
      include: ['store', 'category']
    });

    const resultado = productos.map(p => {
      const soldAt = new Date(p.soldAt);
      const expiraEn = new Date(soldAt);
      expiraEn.setDate(expiraEn.getDate() + 7);
      const msRestantes = expiraEn - ahora;
      const diasRestantes = Math.max(0, Math.ceil(msRestantes / (1000 * 60 * 60 * 24)));
      const horasRestantes = Math.max(0, Math.ceil(msRestantes / (1000 * 60 * 60)));

      return {
        id: p.id,
        name: p.name,
        price: p.price,
        condition: p.condition,
        size: p.size,
        store: p.store?.name,
        category: p.category?.name,
        sold_at: p.soldAt,
        expira_en: expiraEn,
        dias_restantes: diasRestantes,
        horas_restantes: horasRestantes,
        urgente: diasRestantes <= 1
      };
    });

    // Ordenar por días restantes (más urgentes primero)
    resultado.sort((a, b) => a.dias_restantes - b.dias_restantes);

    res.json(resultado);
  } catch (error) {
    next(error);
  }
});

// Admin: todos los productos incluyendo sin stock
router.get('/admin/todos', async (req, res, next) => {
  try {
    const { models } = require('../libs/sequelize');
    const productos = await models.Product.findAll({
      include: ['store', 'category']
    });
    res.json(productos);
  } catch (error) {
    next(error);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const products = await service.find();
    res.json(products);
  } catch (error) {
    next(error);
  }
});

router.get('/:id',
  validatorHandler(getProductSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const product = await service.findOne(id);
      res.json(product);
    } catch (error) {
      next(error);
    }
  }
);

// NUEVA RUTA: Subir imagen
router.post('/upload-image', upload.single('image'), (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No se subió ningún archivo' });
    }
    
    // Retornar la URL de la imagen
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/products/${req.file.filename}`;
    res.json({ imageUrl });
  } catch (error) {
    next(error);
  }
});

router.post('/',
  validatorHandler(createProductSchema, 'body'),
  async (req, res, next) => {
    try {
      const body = req.body;
      const newProduct = await service.create(body);
      res.status(201).json(newProduct);
    } catch (error) {
      next(error);
    }
  }
);

router.patch('/:id',
  validatorHandler(getProductSchema, 'params'),
  validatorHandler(updateProductSchema, 'body'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const body = req.body;
      const product = await service.update(id, body);
      res.json(product);
    } catch (error) {
      next(error);
    }
  }
);

router.delete('/:id',
  validatorHandler(getProductSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      await service.delete(id);
      res.status(201).json({id});
    } catch (error) {
      next(error);
    }
  }
);


// Obtener imágenes adicionales de un producto
router.get('/:id/images', async (req, res, next) => {
  try {
    const { models } = require('../libs/sequelize');
    const images = await models.ProductImage.findAll({
      where: { product_id: req.params.id },
      order: [['orden', 'ASC']]
    });
    res.json(images);
  } catch(e) { next(e); }
});

// Agregar imagen adicional
router.post('/:id/images', async (req, res, next) => {
  try {
    const { models } = require('../libs/sequelize');
    const { image, orden } = req.body;
    if (!image) return res.status(400).json({ error: 'Imagen requerida' });
    const img = await models.ProductImage.create({
      productId: req.params.id,
      image,
      orden: orden || 0
    });
    res.status(201).json(img);
  } catch(e) { next(e); }
});

// Eliminar imagen adicional
router.delete('/:id/images/:imageId', async (req, res, next) => {
  try {
    const { models } = require('../libs/sequelize');
    await models.ProductImage.destroy({
      where: { id: req.params.imageId, product_id: req.params.id }
    });
    res.json({ success: true });
  } catch(e) { next(e); }
});

module.exports = router;