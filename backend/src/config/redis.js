const { createClient } = require('redis')

const redisClient = createClient({
  username: 'default',
  password: process.env.REDIS_PASS,
  socket: {
    host: 'redis-14417.crce276.ap-south-1-3.ec2.cloud.redislabs.com',
    port: 14417
  }
})

redisClient.on('error', err => {
  console.error('Redis error:', err)
})

module.exports = redisClient
