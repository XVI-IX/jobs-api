const Redis = require('redis');
const redisClient = Redis.createClient({ legacyMode: true });

redisClient.connect();

const { APIAccessError } = require('../errors');
const { StatusCodes } = require('http-status-codes');


const limiter = (req, res, next) => {
  const authHeader = String(req.headers.authorization);
  redisClient.exists(authHeader, (err, reply) => {
    if (err) {
      res.status(StatusCodes.BAD_GATEWAY).json({
        error: 1,
        msg: "Redis could not connect"
      });
    }
    if (reply === 1) {
      console.log(reply);
      redisClient.get(authHeader, (err, reply) => {
        let data = JSON.parse(reply);
        console.log(data);
        let currentTime = new Date().getTime();
        let timeDiff = (currentTime - data.startTime) / 60000;

        if (timeDiff >= 1) {

          // reset data
          let body = {
            count: 1,
            startTime: new Date().getTime()
          }

          redisClient.set(authHeader, JSON.stringify(body));

          next();
        }
        if (timeDiff < 1) {
          if (data.count > 3) {
            res.status(StatusCodes.SERVICE_UNAVAILABLE).json({
              error: -1,
              msg: "API access limit exceeded"
            });
          }

          data.count++;
          redisClient.set(req.headers.authorization, JSON.stringify(data));

          next();
        }
      });
    } else {
      let body = {
        count: 1,
        startTime: new Date().getTime(),
      }

      redisClient.set(authHeader, JSON.stringify(body));

      next();
    }
  });
}

module.exports = limiter;