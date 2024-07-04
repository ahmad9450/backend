import dotenv from 'dotenv';
dotenv.config();
import {app} from './app.js';
import connectDb from './db/db.js';

const port = process.env.PORT || 6000;

connectDb()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch(err => {
    console.error('Failed to connect to the database', err);
  });
