<?php

use App\Domain\Payment\Payment;
use App\Domain\Transaction\Transaction;
use Illuminate\Database\Seeder;

class TransactionsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $now = \Carbon\Carbon::now()->toDateTimeString();
        $payments = Payment::with('address')->get();

        $transactions = [];
        foreach ($payments as $payment) {
            $transactions[] = [
                'user_id' => $payment->address->user_id,
                'payment_id' => $payment->id,
                'type' => 'deposit',
                'amount' => $payment->amount,
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }


        Transaction::insert($transactions);
    }
}
