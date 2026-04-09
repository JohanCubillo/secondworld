/**
 * limpiar-imagenes.js
 * Borra imágenes base64 de productos vendidos hace más de 7 días
 */
require('dotenv').config();
const sequelize = require('./libs/sequelize');
const { models } = sequelize;
const { Op } = require('sequelize');

async function limpiarImagenes() {
    try {
        await sequelize.authenticate();
        
        const hace7dias = new Date();
        hace7dias.setDate(hace7dias.getDate() - 7);

        // Buscar productos vendidos hace más de 7 días con imagen aún
        const productos = await models.Product.findAll({
            where: {
                stock: 0,
                sold_at: { [Op.lt]: hace7dias },
                image_deleted: false,
                image: { [Op.ne]: null }
            }
        });

        console.log(`🔍 Productos a limpiar: ${productos.length}`);

        for (const p of productos) {
            await p.update({ image: null, image_deleted: true });
            console.log(`🗑️ Imagen borrada: ${p.name} (vendido: ${p.sold_at})`);
        }

        console.log('✅ Limpieza completada');
    } catch(e) {
        console.error('❌ Error:', e.message);
    } finally {
        await sequelize.close();
    }
}

limpiarImagenes();
