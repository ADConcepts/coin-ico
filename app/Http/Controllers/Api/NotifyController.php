<?php

namespace App\Http\Controllers\Api;

use App\Domain\Address\Address;
use App\Domain\CoinbaseNotification;
use App\Domain\ExchangeRate\ExchangeRate;
use App\Domain\Payment\Payment;
use App\Domain\Referral\Referral;
use App\Domain\Transaction\Transaction;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Coinbase\Wallet\Client;
use Coinbase\Wallet\Configuration;

class NotifyController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    public function getNotify(Request $request)
    {
        $raw_body = file_get_contents('php://input');

        //$signature = $_SERVER['HTTP_CB_SIGNATURE'];
        //$configuration = Configuration::apiKey(config('coinbase.apiKey'), config('coinbase.apiSecret'));
        //$client = Client::create($configuration);
        //$authenticity = $client->verifyCallback($raw_body, $signature); // boolean

        $coinbaseNotification = new CoinbaseNotification();
        $coinbaseNotification->notification = $raw_body;
        $coinbaseNotification->save();

       /* $raw_body = [
            "id" => "f30b5c10-cc5b-51dc-8962-2c3d904f9d87",
            "type" => "wallet:addresses:new-payment",
            "data" => [
                "id" => "f6358ae5-237c-5746-9d1f-3a7725c24019",
                "address" => "1AqWpctoenRQdArf5MHdMcYTHSmmb1yrN4",
                "name" => null,
                "created_at" => "2017-09-09T12:59:06Z",
                "updated_at" => "2017-09-09T12:59:06Z",
                "network" => "bitcoin",
                "resource" => "address",
                "resource_path" => "/v2/accounts/602cc0d3-8ccf-5820-84e4-5f50470290e7/addresses/f6358ae5-237c-5746-9d1f-3a7725c24019"
            ],
            "user" => [
                "id" => "0e220dfa-7fd9-5b45-834d-b1c9ea3c4449",
                "resource" => "user",
                "resource_path" => "/v2/users/0e220dfa-7fd9-5b45-834d-b1c9ea3c4449"
            ],
            "account" => [
                "id" => "602cc0d3-8ccf-5820-84e4-5f50470290e7",
                "resource" => "account",
                "resource_path" => "/v2/accounts/602cc0d3-8ccf-5820-84e4-5f50470290e7"
            ],
            "delivery_attempts" => 1,
            "created_at" => "2017-09-09T13:08:15Z",
            "resource" => "notification",
            "resource_path" => "/v2/notifications/f30b5c10-cc5b-51dc-8962-2c3d904f9d87",
            "additional_data" => [
                "hash" => "aefd7171b43a5a57f6a894a5fbf8d67b2df640131fd6e746aa02436f9a4f0e23",
                "amount" => [
                    "amount" => "0.00017000",
                    "currency" => "BTC",
                ],
                "transaction" => [
                    "id" => "70cca6dd-ad7b-5c7f-a92a-12435c60a04a",
                    "resource" => "transaction",
                    "resource_path" => "/v2/accounts/602cc0d3-8ccf-5820-84e4-5f50470290e7/transactions/70cca6dd-ad7b-5c7f-a92a-12435c60a04e"
                ],
            ],
            "delivered_at" => "2017-09-09T13:08:16Z",
            "delivery_response" => [
                "message" => "Notification delivered",
                "body" => "ok",
                "status_code" => 200,
            ],
            "subscriber" => [
                "type" => "api_key",
                "api_key" => "sLpL1JycDrKNv0PT",
            ]
        ];*/


        if (isset($raw_body['data']) && !empty($raw_body['data'])) {
            $currencies = config('app.currencies');
            $address = Address::query()
                ->where('address', $raw_body['data']['address'])
                ->first();
            if (!$address) {
                return "false";
            }
            $currency = $currencies[$raw_body['additional_data']['amount']['currency']];

            $exchangeRate = ExchangeRate::query()
                ->where('currency', $currency)
                ->orderBy('id', 'desc')
                ->first();

            $amount = $raw_body['additional_data']['amount']['amount'] * $exchangeRate->amount;

            $payment = new Payment();
            $payment->address_id = $address->id;
            $payment->exchange_rate_id = $exchangeRate->id;
            $payment->notification_id = $raw_body['id'];
            $payment->amount = $amount;
            $payment->currency = $currency;
            $payment->currency_transaction_id = $raw_body['additional_data']['transaction']['id'];
            $payment->exchange_rate = $exchangeRate->amount;
            $payment->save();

            $transaction = new Transaction();
            $transaction->user_id = $address->user_id;
            $transaction->payment_id = $payment->id;
            $transaction->type = 'deposit';
            $transaction->amount = $amount;
            $transaction->save();


            // Redeem Referral
            $referral = Referral::query()
                ->where('referral_id',$address->user_id)
                ->whereNull('first_buy_at')
                ->first();

            if($referral){
                $now = \Carbon\Carbon::now()->toDateTimeString();

                $transaction = new Transaction();
                $transaction->user_id = $referral->user_id;
                $transaction->referral_id = $referral->id;
                $transaction->amount = ($amount*5) / 100;
                $transaction->type = 'referral';
                $transaction->save();

                $referral->first_buy_at = $now;
                $referral->save();
            }

            return "true";

        }

    }
}
