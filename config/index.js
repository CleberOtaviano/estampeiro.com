const mongoose = require('mongoose');
const config = {};

mongoose.connect('mongodb://localhost:27017/estampeiro');

var db = mongoose.connection;
db.on('error', function(err){
    console.log('Erro de conexao.', err)
});
db.on('open', function () {
  console.log('Conexão aberta.')
});
db.on('connected', function(err){
    console.log('Conectado')
});
db.on('disconnected', function(err){
    console.log('Desconectado')
});

  // url: process.env.REDIS_STORE_URI,
  // secret: process.env.REDIS_STORE_SECRET
config.redisStore = {
  url: 'redis://localhost:6379',
  secret: 'secretKey'
}

config.db = db;

module.exports = config