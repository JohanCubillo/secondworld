const axios = require('axios');

const products = [
  {
    name: "Laptop HP",
    price: 850,
    image: "https://picsum.photos/200/300?random=1"
  },
  {
    name: "Mouse Gamer",
    price: 45,
    image: "https://picsum.photos/200/300?random=2"
  },
  {
    name: "Teclado RGB",
    price: 75,
    image: "https://picsum.photos/200/300?random=3"
  },
  {
    name: "Monitor 24in",
    price: 320,
    image: "https://picsum.photos/200/300?random=4"
  },
  {
    name: "Webcam HD",
    price: 65,
    image: "https://picsum.photos/200/300?random=5"
  }
];

async function seedProducts() {
  for (const product of products) {
    try {
      const response = await axios.post('http://localhost:3001/api/v1/products', product);
      console.log('✅ Producto creado:', response.data.name);
    } catch (error) {
      console.error('❌ Error completo:', error.response?.data);
      console.error('Detalle:', error.message);
      console.error('Stack:', error.stack);
    }
  }
  console.log('🎉 Productos agregados!');
}

seedProducts();