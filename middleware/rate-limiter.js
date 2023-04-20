const { StatusCodes } = require('http-status-codes');
const Redis = require('ioredis');

const redis = new Redis();

const limiter = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  redis.exists(authHeader)
        .then(
          async (result) => {
          if (result === 1) {
            console.log(result);
            redis.get(authHeader)
                  .then(
                    (result) => {
                      let data = JSON.parse(result);
                      console.log(data);
                      let currentTime = new Date().getTime();
                      let timeDiff = (currentTime - data.startTime) / 60000;

                      if (timeDiff >= 1) {
                        let body = {
                          count: 1,
                          startTime: new Date().getTime()
                        }

                        redis.set(authHeader, JSON.stringify(body));

                        next();
                      }
                      if (timeDiff < 1) {
                        if (data.count > 3) {
                          res.status(StatusCodes.SERVICE_UNAVAILABLE).json({
                            error: -1,
                            msg: "API access limit exceeded"
                          })
                        }

                        data.count++;
                        redis.set(authHeader, JSON.stringify(data));

                        next();
                      }
                    }
                  )
          } else {
            let body = {
              count: 1,
              startTime: new Date().getTime()
            }

            redis.set(authHeader, JSON.stringify(body));

            next();
          }
        },
        (err) => {
          res.status(StatusCodes.BAD_GATEWAY).json({
            error: 1,
            msg: "Redis could not connect"
          });
        });
}

module.exports = limiter;