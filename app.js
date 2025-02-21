import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import dotenv from 'dotenv';
import authRouter from './routes/auth.routes.js';
import userRouter from './routes/user.routes.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.get('/', (_, res) => {
  res.status(200).json({ success: true, message: "Welcome to RY ShipChain Backend" });
});

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

connectDB()
  .then(() => {
    app.listen(port, () =>
      console.log(`RY ShipChain Backend is running on port ${port}`)
    );
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

