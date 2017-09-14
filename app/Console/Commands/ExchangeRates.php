<?php

namespace App\Console\Commands;

use App\Domain\ExchangeRate\ExchangeRate;
use Illuminate\Console\Command;

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
        $json = file_get_contents('https://api.coinmarketcap.com/v1/ticker/');
        $data = json_decode($json);
        $currencies = [];
        foreach ($data as $key => $value) {
            if (count($currencies) == 3) {
                break;
            }
            if (in_array($value->id, ['bitcoin', 'litecoin', 'ethereum'])) {
                $now = \Carbon\Carbon::now()->toDateTimeString();
                $currencies[] = $value->id;

                $oldExchangeRate = ExchangeRate::query()
                    ->where('currency', $value->id)
                    ->orderBy('id', 'desc')
                    ->first();

                if ($oldExchangeRate) {
                    $oldExchangeRate->end_date = $now;
                    $oldExchangeRate->save();
                }

                $exchangeRate = new ExchangeRate();
                $exchangeRate->currency = $value->id;
                $exchangeRate->start_date = $now;
                $exchangeRate->dollar = $value->price_usd;

                $rate = config('coinbase.exchangeRate')[$value->id];
                $amount = $value->price_usd * $rate;
                $exchangeRate->amount = $amount;

                $exchangeRate->created_at = $now;
                $exchangeRate->updated_at = $now;

                $exchangeRate->save();
            }
        }
    }
}
