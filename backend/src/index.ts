import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import chatRouter from './routes/chat';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api', chatRouter);

// Test route
app.get('/api/test', (req: Request, res: Response) => {
  res.json({ message: 'Backend is working!' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 