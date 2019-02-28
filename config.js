// Configuration

const env = process.env.NODE_ENV // 'prod', 'dev', 'test'

const prod = require('./configs/config.prod')
const dev = require('./configs/config.dev')
const test = require('./configs/config.test')

const config = {
  prod,
  dev,
  test
}

module.exports = config[env]
