<?php

use App\Domain\ExchangeRate\ExchangeRate;
use Illuminate\Database\Seeder;

class ExchangeRatesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $now = \Carbon\Carbon::now();
        $faker = \Faker\Factory::create();
        $currencies = [
            [
                'currency' => 'bitcoin',
                'dollar' => 3855.250,
                'min' => -500,
                'max' => 500,
            ],
            [
                'currency' => 'litecoin',
                'dollar' => 285.919,
                'min' => -50,
                'max' => 50,
            ],
            [
                'currency' => 'ethereum',
                'dollar' => 53.0299,
                'min' => -5,
                'max' => 5,
            ],
        ];

        $exchangeRates = [];
        $daysAgo = $now->diffInDays($now->copy()->subMonth());

        for ($day = $daysAgo; $day >= 0; $day -= 1) {
            $date = $now->copy()->subDay($day);

            foreach ($currencies as $currency) {
                $dollar = $faker->numberBetween($currency['min'], $currency['max']) + $currency['dollar'];
                $dollar = number_format($dollar, 2, '.', '');

                $exchangeRates[] = [
                    'currency' => $currency['currency'],
                    'amount' => (1 * $dollar) / config('app.exchangeRate.' . $currency['currency']),
                    'dollar' => $dollar,
                    'start_date' => $date->toDateTimeString(),
                    'end_date' => $day == 0 ? null : $date->copy()->addDay(),
                    'created_at' => $date->toDateTimeString(),
                    'updated_at' => $date->toDateTimeString(),
                ];
            }
        }

        ExchangeRate::insert($exchangeRates);
    }
}
