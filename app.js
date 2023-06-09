require('dotenv').config();
require('express-async-errors');
const express = require('express');
const app = express();

// Extra Security
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');

// connectDB
const connectDB = require('./db/connect');
const MONGO = process.env.MONGO_URI;
const auth = require("./middleware/authentication");
const limiter = require('./middleware/rate-limiter');

const port = process.env.PORT || 3000;


// routers
const authRouter = require('./routes/auth');
const jobsRouter = require('./routes/jobs');

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.set('trust proxy', 1);
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());

// extra packages

// routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/jobs', auth, limiter, jobsRouter);
// app.use('/api/v1/jobs', jobsRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);


const start = async () => {
  try {
    await connectDB(MONGO);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
