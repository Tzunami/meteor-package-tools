// Price ticker
EthTools.ticker = new Mongo.Collection('ethereum_price_ticker', {connection: null});
if(Meteor.isClient)
    new PersistentMinimongo(EthTools.ticker);

var updatePrice = function(e, res){

    if(!e && res && res.statusCode === 200) {
        var content = JSON.parse(res.content);

        if(content){
            _.each(content, function(price, key){
                var name = key.toLowerCase();

                // make sure its a number and nothing else!
                if(_.isFinite(price)) {
                    EthTools.ticker.upsert(name, {$set: {
                        price: String(price),
                        timestamp: null
                    }});
                }
				//ETH Ticker exception here also in observeTransaction.js in meteor-dapp-wallet
				// modify ed = eth, reset eth
				EthTools.ticker.upsert('ed', {$set: {
					price: 10,
					timestamp: null
				}});
            });
        }
    } else {
        console.warn('Can not connect to https://mini-api.cryptocompare.com to get price ticker data, please check your internet connection.');
    }
};

// update right away
HTTP.get('https://www.cryptocompare.com/api/data/price?fsym=ETH&tsyms=USD,EUR,GBP,CNY,CAD,EUR,GBP,JPY', updatePrice);
    

// update prices
Meteor.setInterval(function(){
    HTTP.get('https://www.cryptocompare.com/api/data/price?fsym=ETH&tsyms=USD,EUR,GBP,CNY,CAD,EUR,GBP,JPY', updatePrice);    
}, 1000 * 30);
