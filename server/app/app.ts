import express ,{Request, Response} from 'express';
import cors from 'cors';

import guestRoutes from '../routes/guests.routes.ts';
import plusOneRoutes from '../routes/guestPlusOne.routes.ts';
import nameSearchRoutes from '../routes/nameSearch.routes.ts';

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'https://www.jasmenandlucas.com',
  'https://jasmenandlucas.com',
];

app.use(express.json());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('CORS blocked'));
      }
    },
  })
);


app.get('/', (req:Request,res:Response)=>{
    res.send('Hello World!');
});

app.use('/guests', nameSearchRoutes);
app.use('/guests', guestRoutes);
app.use('/plus-ones', plusOneRoutes);


export default app;