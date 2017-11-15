<?php

use App\Domain\Address\Address;
use App\Domain\ExchangeRate\ExchangeRate;
use App\Domain\Payment\Payment;
use App\Domain\Transaction\Transaction;
use App\User;

class UsersSeeder extends AppSeeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // 1) 200 users
        // 2) make addresses for 180 users
        // 3) 90 payments
        // 4) 90 deposit transactions


        // 1)
        $users = [];
        for ($i = 1; $i <= 200; $i += 1) {
            $users[] = $this->fakeUser($i);
        }

        User::insert($users);

        // 2)
        $users = User::all();
        $addresses = [];

        $addresses[] = $this->fakeAddress(2, 'bitcoin');
        $addresses[] = $this->fakeAddress(2, 'litecoin');
        $addresses[] = $this->fakeAddress(2, 'ethereum');
        $addresses[] = $this->fakeAddress(3, 'litecoin');
        $addresses[] = $this->fakeAddress(4, 'ethereum');
        $addresses[] = $this->fakeAddress(5, 'bitcoin');
        $addresses[] = $this->fakeAddress(5, 'ethereum');

        $addressUsers = $users->slice(5, 180);

        foreach ($addressUsers as $user) {
            $addresses[] = $this->fakeAddress(
                $user->id,
                $this->faker->randomElement($this->currencies)
            );
        }

        Address::insert($addresses);

        // 3)
        $address = Address::all();
        $paymentAddresses = $address->slice(0, 90);
        $exchangeRates = ExchangeRate::all()->groupBy('currency')->toArray();
        $payments = [];

        foreach ($paymentAddresses as $address) {
            $payments[] = $this->fakePayment($address, $exchangeRates);
        }
        usort($payments, function ($item1, $item2) {
            return $item1['created_at'] <=> $item2['created_at'];
        });

        Payment::insert($payments);

        // 4)
        $allPayments = Payment::with('address')->get();
        $transactions = [];
        foreach ($allPayments as $payment) {
            $transactions[] = $this->fakeTransaction($payment);
        }
        Transaction::insert($transactions);

        // 6)
        $bonus = env('BONUS', 0);
        if ($bonus > 0) {
            $payments = $allPayments->slice(40, 30);
            $transactions = [];
            foreach ($payments as $payment) {
                $transactions[] = $this->fakeBonusTransaction($payment);
            }

            Transaction::insert($transactions);
        }
    }
}
