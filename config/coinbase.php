<?php

return [

    'apiKey' => env('COINBASE_APP_KEY', NULL),
    'apiSecret' => env('COINBASE_APP_SECRET', NULL),
    'accountId' => [
        'ethereum' => env('COINBASE_ETHEREUM_ACCOUNT_ID', NULL),
        'bitcoin' => env('COINBASE_BITCOIN_ACCOUNT_ID', NULL),
        'litecoin' => env('COINBASE_LITECOIN_ACCOUNT_ID', NULL),
    ],
];
