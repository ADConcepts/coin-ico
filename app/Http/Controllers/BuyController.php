<?php

namespace App\Http\Controllers;

use App\Domain\ExchangeRate\ExchangeRate;
use Illuminate\Http\Request;
use Coinbase\Wallet\Client;
use Coinbase\Wallet\Configuration;
use Coinbase\Wallet\Resource\Address;
use App\Domain\Address\Address as Addresses;
use Endroid\QrCode\QrCode;
use Illuminate\Http\Response;

class BuyController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function getBuy(Request $request)
    {
        $pageTitle = 'Buy';
        $user = $request->user();
        if ($request->input('currency')) {

            $currency = $request->input('currency');
            $accountId = config('coinbase.accountId')[$currency];

            $configuration = Configuration::apiKey(config('coinbase.apiKey'), config('coinbase.apiSecret'));

            $client = Client::create($configuration);
            $account = $client->getAccount($accountId);

            $coinBaseAddress = new Address([
                'name' => $user->email
            ]);
            $client->createAccountAddress($account, $coinBaseAddress);

            $address = new Addresses();
            $address->user_id = $user->id;
            $address->coinbase_id = $coinBaseAddress->getId();
            $address->address = $coinBaseAddress->getAddress();
            $address->name = $coinBaseAddress->getName();
            $address->currency = $currency;
            $address->save();

            $qrCode = new QrCode($coinBaseAddress->getAddress());

            $response = new Response($qrCode->writeString(), Response::HTTP_OK, ['Content-Type' => $qrCode->getContentType()]);

            $imageData = "data:image/png;base64," . base64_encode($response->getContent());

            $exchangeRate = ExchangeRate::query()
                ->where('currency', $currency)
                ->orderBy('id', 'desc')
                ->first();

            $bonus = env('BONUS', 0);

            return view('buy-address', compact('user', 'address', 'currency', 'imageData', 'exchangeRate', 'pageTitle', 'bonus'));
        } else {
            $buyTemplate = (date('Y-m-d') < date('Y-m-d', strtotime(env('COUNTER_END_DATE')))) ? 'buy' : 'buy-now';
            return view($buyTemplate, compact('user', 'pageTitle'));
        }
    }

    public function getBuyNow(Request $request)
    {
        $pageTitle = 'Buy';
        $user = $request->user();
        if ($request->input('currency')) {

            $currency = $request->input('currency');
            $accountId = config('coinbase.accountId')[$currency];

            $configuration = Configuration::apiKey(config('coinbase.apiKey'), config('coinbase.apiSecret'));

            $client = Client::create($configuration);
            $account = $client->getAccount($accountId);

            $coinBaseAddress = new Address([
                'name' => $user->email
            ]);
            $client->createAccountAddress($account, $coinBaseAddress);

            $address = new Addresses();
            $address->user_id = $user->id;
            $address->coinbase_id = $coinBaseAddress->getId();
            $address->address = $coinBaseAddress->getAddress();
            $address->name = $coinBaseAddress->getName();
            $address->currency = $currency;
            $address->save();

            $qrCode = new QrCode($coinBaseAddress->getAddress());

            $response = new Response($qrCode->writeString(), Response::HTTP_OK, ['Content-Type' => $qrCode->getContentType()]);

            $imageData = "data:image/png;base64," . base64_encode($response->getContent());

            $exchangeRate = ExchangeRate::query()
                ->where('currency', $currency)
                ->orderBy('id', 'desc')
                ->first();

            $bonus = env('BONUS', 0);

            return view('buy-address', compact('user', 'address', 'currency', 'imageData', 'exchangeRate', 'pageTitle', 'bonus'));
        } else {
            return view('buy-now', compact('user', 'pageTitle'));
        }
    }
}
