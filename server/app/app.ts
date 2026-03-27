import express ,{Request, Response} from 'express';
import cors from 'cors';

import guestRoutes from '../routes/guests.routes.ts';
import plusOneRoutes from '../routes/guestPlusOne.routes.ts';
import nameSearchRoutes from '../routes/nameSearch.routes.ts';

const app = express();

app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173' }));

app.get('/', (req:Request,res:Response)=>{
    res.send('Hello World!');
});

app.use('/guests', nameSearchRoutes);
app.use('/guests', guestRoutes);
app.use('/plus-ones', plusOneRoutes);


export default app;