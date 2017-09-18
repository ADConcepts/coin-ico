<?php

use App\Domain\Address\Address;
use Illuminate\Database\Seeder;

class AddressesTableSeeder extends Seeder
{
    /**
     * @var \Faker\Generator
     */
    private $faker;
    private $now;

    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $this->now = \Carbon\Carbon::now()->toDateTimeString();
        $this->faker = \Faker\Factory::create();
        $currencies = ['bitcoin', 'litecoin', 'ethereum'];

        $addresses = [];

        $addresses[] = $this->fakeAddress(1, 'bitcoin');
        $addresses[] = $this->fakeAddress(1, 'litecoin');
        $addresses[] = $this->fakeAddress(1, 'ethereum');
        $addresses[] = $this->fakeAddress(2, 'litecoin');
        $addresses[] = $this->fakeAddress(3, 'ethereum');
        $addresses[] = $this->fakeAddress(4, 'bitcoin');
        $addresses[] = $this->fakeAddress(4, 'ethereum');

        for ($i = 1; $i <= 100; $i += 1) {
            $addresses[] = $this->fakeAddress(
                $this->faker->numberBetween(6, 200),
                $this->faker->randomElement($currencies)
            );
        }

        Address::insert($addresses);
    }

    public function fakeAddress($userId, $currency)
    {
        return [
            'user_id' => $userId,
            'coinbase_id' => $this->faker->uuid,
            'address' => $this->faker->uuid,
            'name' => $this->faker->word,
            'currency' => $currency,
            'created_at' => $this->now,
            'updated_at' => $this->now,
        ];
    }
}
