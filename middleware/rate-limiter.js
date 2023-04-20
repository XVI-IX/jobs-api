const { StatusCodes } = require('http-status-codes');
const Redis = require('ioredis');

const redis = new Redis();

const limiter = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const exists = await redis.exists(authHeader);

    if (exists === 1) {
      const result = await redis.get(authHeader);
      const data = JSON.parse(result);
      const currentTime = new Date().getTime();
      const timeDiff = (currentTime - data.startTime) / 60000;

      if (timeDiff >= 1) {
        const body = {
          count: 1,
          startTime: new Date().getTime()
        }

        await redis.set(authHeader, JSON.stringify(body));
        next();
      }
      if (timeDiff < 1) {
        if (data.count > 3) {
        res.status(StatusCodes.SERVICE_UNAVAILABLE).json({
          error: -1,
          msg: 'API access limit exceeded'
        });
      }

        data.count++;
        await redis.set(authHeader, JSON.stringify(data));

        next();
      }
    } else {
      const body = {
        count: 1,
        startTime: new Date().getTime()
      }

      await redis.set(authHeader, JSON.stringify(body));
      next();
    }
  } catch (err) {
    res.status(StatusCodes.BAD_GATEWAY).json({
      error: -1,
      msg: "Redis could not connect"
    });
  }
}

module.exports = limiter;