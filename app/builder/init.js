const passport = require('passport');
const requestify = require('requestify');
const http = require('http');



var apiKey = 'ak_test_0klffqJlOuXiqPTT1g35q9pTEZz4oU',
    //Example POST method invocation
    Client = require('node-rest-client').Client;

    var client = new Client();

function initHome(app) {
  app.get('/builder', function(req, res) {

    let isLogado = req.user ? true : false;

    packColors = [
      {name: 'Vermelho', hexa: '#db2828', ref: 'red'},
      {name: 'Verde', hexa: '#21ba45', ref: 'green'},
      {name: 'Azul', hexa: '#2185d0', ref: 'blue'},
      {name: 'Branco', hexa: '#ffffff', ref: 'white'},
      {name: 'Laranja', hexa: '#f2711c', ref: 'orange'}
    ]

    res.render('builder/index', {
        isLogado,
        notLayoutMenu: true,
        invertedMenu: false,
        noFooter: true,
        cores: packColors
    })
  });


  // AGORA FALTA PASSAR OS DADOS DA COMPRA, PREÇO, QUANTIDADE, ETC
  app.post('/compra', function(req, res) {
    var cardHash = req.body.cardHash,
        args = {
            parameters : {
                api_key: apiKey,
                card_hash: cardHash,
                amount: 1250
            },
            headers: { "Content-Type": "application/x-www-form-urlencoded" }
        };

    // Nova compra
    client.post("https://api.pagar.me/1/transactions", args, function (data, response) {

        if (data.errors) {
            console.log('deu ruim: ', data.errors);

            res.json(data);
        } else {
            res.json(data);
        }
    });
  });
}

module.exports = initHome
