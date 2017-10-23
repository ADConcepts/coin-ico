<?php

use App\Domain\Address\Address;
use App\Domain\ExchangeRate\ExchangeRate;
use App\Domain\Payment\Payment;
use App\Domain\Referral\Referral;
use App\Domain\Transaction\Transaction;
use App\User;


class UsersReferralSeeder extends AppSeeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // 1) 30 referral users
        // 2) make addresses for 30 users
        // 3) make 40 referrals
        // 4) 15 payments
        // 5) 15 deposit transactions
        // 6) 15 referral transactions


        // 1)
        $users = [];
        for ($i = 201; $i <= 230; $i += 1) {
            $users[] = $this->fakeUser($i);
        }

        User::insert($users);

        // 2)
        $users = User::all()->keyBy('id');
        $addresses = [];
        $addressUsers = $users->slice(200, 30);

        foreach ($addressUsers as $user) {
            $addresses[] = $this->fakeAddress(
                $user->id,
                $this->faker->randomElement($this->currencies)
            );
        }

        Address::insert($addresses);

        // 3)
        $referrals = [];

        $referrals[] = $this->fakeReferral(201, $users, 2);
        $referrals[] = $this->fakeReferral(202, $users, 2);
        $referrals[] = $this->fakeReferral(203, $users, 2);
        for ($i = 204; $i <= 230; $i += 1) {
            $referrals[] = $this->fakeReferral($i, $users);
        }

        Referral::insert($referrals);

        // 4)
        $address = Address::all();
        $paymentAddresses = $address->slice(188, 15);
        $exchangeRates = ExchangeRate::all()->groupBy('currency')->toArray();
        $payments = [];

        foreach ($paymentAddresses as $address) {
            $payments[] = $this->fakePayment($address, $exchangeRates);
        }
        usort($payments, function ($item1, $item2) {
            return $item1['created_at'] <=> $item2['created_at'];
        });

        Payment::insert($payments);

        // 5)
        $payments = Payment::with('address')->get();
        $payments = $payments->slice(91, 15);
        $transactions = [];
        foreach ($payments as $payment) {
            $transactions[] = $this->fakeTransaction($payment);
        }

        Transaction::insert($transactions);

        // 6)
        $referrals = Referral::all();
        $referrals = $referrals->keyBy('referral_id');
        $transactions = [];
        foreach ($payments as $payment) {
            $referral = $referrals[$payment->address->user_id];
            $transactions[] = $this->fakeReferralTransaction($referral, $payment);
            $referral->first_buy_at = $payment->created_at;
            $referral->save();
        }

        Transaction::insert($transactions);
    }
}
