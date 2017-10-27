<?php

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $this->call(ExchangeRatesTableSeeder::class);
        $this->call(CountryTableSeeder::class);
        $this->call(UsersSeeder::class);
        $this->call(UsersReferralSeeder::class);
    }
}
