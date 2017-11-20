#Coin ICO

## Installation

Install Laravel Homestead. Clone this repository and run

```bash
cp .env.example .env
composer install
php artisan key:generate
php artisan migrate:fresh --seed
npm install
npm run production
```

You can watch the assets for changes and automatically recompile them with

```bash
npm run watch
```

Note: Use the following command if Webpack isn't updating when your files change, 

```bash
npm run watch-poll
```

### For Update Exchange rate 
```$xslt
php artisan schedule:run
```

### For Coinbase API

Add COINBASE_APP_KEY in your .env file

Add COINBASE_APP_SECRET in your .env file

Add COINBASE_ETHEREUM_ACCOUNT_ID in your .env file

Add COINBASE_BITCOIN_ACCOUNT_ID in your .env file

Add COINBASE_LITECOIN_ACCOUNT_ID in your .env file

####Permissions needed in coinbase app

wallet:account:read

wallet:addresses:create

wallet:addresses:read

wallet:notifications:read

> https://developers.coinbase.com/


### Webhook URL

> https://cryptedunited.com/api/notify


### For Exchange rate

Add ETHEREUM_EXCHANGE_RATE in your .env file

Add BITCOIN_EXCHANGE_RATE in your .env file

Add LITECOIN_EXCHANGE_RATE in your .env file


### For Bonus(%)

Add BONUS  in your .env file

### For Load Secure Assets

Add REDIRECT_HTTPS with true value in .env file

### For Update Countdown

Add `COUNTER_END_DATE` in your .env file. date format should be `YYYY-MM-DD`.