import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import db from './config/db';
import morgan from 'morgan';
import routes from './routes';

const app = express();

app.use(morgan('combined'));
app.use(cors());
app.use(helmet());
app.use(express.json());

routes(app);
app.get('/api/health', (req, res) => {
  res.send('Healthy');
});

db();

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});
