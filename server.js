require('dotenv').config({ path: '.env' });
const connectDB = require('./src/config/connectDB');

const app = require('./src/app');


const PORT = process.env.PORT || 3000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch((error) => {
  console.error('Failed to connect to the database:', error);
}); 
