<?php

use App\Domain\Address\Address;
use App\Domain\ExchangeRate\ExchangeRate;
use App\Domain\Payment\Payment;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class PaymentsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $now = Carbon::now()->toDateTimeString();
        $faker = \Faker\Factory::create();
        $exchangeRates = ExchangeRate::all()->groupBy('currency')->toArray();
        $addresses = Address::all();

        $payments = [];

        foreach ($addresses as $address) {
            if ($faker->numberBetween(1, 5) == 1) {
                continue;
            }

            $exchangeRate = $faker->randomElement($exchangeRates['bitcoin']);
            $date = Carbon::createFromFormat('Y-m-d H:i:s', $exchangeRate['start_date']);
            $date->addMinutes($faker->numberBetween(0, 600));

            $payments[] = [
                'address_id' => $address->id,
                'exchange_rate_id' => $exchangeRate['id'],
                'amount' => $faker->numberBetween(1, 5) / $faker->randomElement([1, 10, 100, 1000, 1000]),
                'currency' => $exchangeRate['currency'],
                'exchange_rate' => $exchangeRate['amount'],
                'notification_id' => $faker->uuid,
                'currency_transaction_id' => $faker->uuid,
                'created_at' => $date->toDateTimeString(),
                'updated_at' => $date->toDateTimeString(),
            ];
        }

        usort($payments, function ($item1, $item2) {
            return $item1['created_at'] <=> $item2['created_at'];
        });

        Payment::insert($payments);
    }
}
