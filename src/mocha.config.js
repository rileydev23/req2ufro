export default {
    require: ['dotenv/config'], // Carga automáticamente las variables de entorno
    extension: ['js'],
    spec: 'src/test/**/*.test.js', // Ruta a tus tests
    timeout: 10000,
  };
  