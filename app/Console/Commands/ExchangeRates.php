<?php

namespace App\Console\Commands;

use App\Domain\ExchangeRate\ExchangeRate;
use App\Notifications\ExceptionMail;
use App\User;
use Illuminate\Console\Command;
use Mockery\Exception;

class ExchangeRates extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'exchange:rates';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'To calculate and update exchange rates with our rate';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $data = [];
        try {
            $client = new \GuzzleHttp\Client();
            $res = $client->request('GET', 'https://api.coinmarketcap.com/v1/ticker/');
            $data = \GuzzleHttp\json_decode($res->getBody());
        } catch (\Exception $e) {
            echo $e->getMessage();
        }
        $currencies = [];
        foreach ($data as $key => $value) {
            if (count($currencies) == 3) {
                break;
            }

            if (!in_array($value->id, ['bitcoin', 'litecoin', 'ethereum'])) {
                continue;
            }

            $now = \Carbon\Carbon::now()->toDateTimeString();
            $currencies[$value->id] = $value->id;

            $oldExchangeRate = ExchangeRate::query()
                ->where('currency', $value->id)
                ->orderBy('id', 'desc')
                ->first();

            if ($oldExchangeRate) {
                $oldExchangeRate->end_date = $now;
                $oldExchangeRate->save();
            }
            $priceUsd = number_format($value->price_usd, 2, '.', '');
            $exchangeRate = new ExchangeRate();
            $exchangeRate->currency = $value->id;
            $exchangeRate->start_date = $now;
            $exchangeRate->dollar = $priceUsd;

            $rate = config('app.exchangeRate')[$value->id];
            $exchangeRate->amount = (1 * $priceUsd) / $rate;

            $exchangeRate->save();
        }

        if (count($currencies) < 3) {
            $user = User::query()
                ->where('is_admin', 1)
                ->first();

            $user->notify(new ExceptionMail($user));
        }

    }
}
