<?php

use App\Domain\Referral\Referral;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use App\User;

class AppSeeder extends Seeder
{
    protected $now;
    protected $faker;
    protected $currencies = ['bitcoin', 'litecoin', 'ethereum'];
    protected static $password = null;

    public function __construct()
    {
        $this->now = \Carbon\Carbon::now()->toDateTimeString();
        $this->faker = \Faker\Factory::create();

        if (!static::$password) {
            static::$password = bcrypt('123456');
        }
    }

    public function fakeUser($id, $createdAt = null)
    {
        return [
            'name' => "user$id",
            'email' => "user$id@mail.com",
            'password' => static::$password,
            'wallet_id' => str_random(34),
            'is_admin' => $id == 1,
            'referral_code' => substr(md5(microtime()),rand(0,26),5),
            'created_at' => $createdAt ?: $this->now,
            'updated_at' => $createdAt ?: $this->now,
        ];
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

    public function fakePayment($address, $exchangeRates)
    {
        $exchangeRate = $this->faker->randomElement($exchangeRates['bitcoin']);
        $date = Carbon::createFromFormat('Y-m-d H:i:s', $exchangeRate['start_date']);
        $date->addMinutes($this->faker->numberBetween(0, 600));

        return [
            'address_id' => $address->id,
            'exchange_rate_id' => $exchangeRate['id'],
            'amount' => $this->faker->numberBetween(1, 5) / $this->faker->randomElement([1, 10, 100, 1000, 1000]),
            'currency' => $exchangeRate['currency'],
            'exchange_rate' => $exchangeRate['amount'],
            'notification_id' => $this->faker->uuid,
            'currency_transaction_id' => $this->faker->uuid,
            'created_at' => $date->toDateTimeString(),
            'updated_at' => $date->toDateTimeString(),
        ];
    }

    public function fakeTransaction($payment, $createdAt = null)
    {
        return [
            'user_id' => $payment->address->user_id,
            'payment_id' => $payment->id,
            'referral_id' => null,
            'transaction_hash' => str_random(60),
            'type' => 'deposit',
            'amount' => $payment->amount * $payment->exchange_rate,
            'created_at' => $createdAt ?: $this->now,
            'updated_at' => $createdAt ?: $this->now,
        ];
    }

    public function fakeReferral($id, $users, $userId = null)
    {
        $userId = ($userId) ? $userId : $this->faker->numberBetween(1, 200);
        return [
            'user_id' => $userId,
            'referral_id' => $id,
            'email' => $users[$id]['email'],
            'referral_code' => $users[$userId]['referral_code'],
            'registered_at' => $users[$id]['created_at'],
            'first_buy_at' => null,
            'created_at' => $users[$id]['created_at'],
            'updated_at' => $users[$id]['created_at'],
        ];
    }

    public function fakeReferralTransaction($referral, $payment)
    {
        return [
            'user_id' => $referral->user_id,
            'payment_id' => null,
            'referral_id' => $referral->id,
            'transaction_hash' => str_random(60),
            'type' => 'referral',
            'amount' => ($payment->amount * 5) / 100 * $payment->exchange_rate,
            'created_at' => $payment->created_at,
            'updated_at' => $payment->created_at,
        ];
    }
}
