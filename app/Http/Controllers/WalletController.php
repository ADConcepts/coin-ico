<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Config;
use App\User;
use App\Domain\Transaction\Transaction;

class WalletController extends Controller
{

    public function getWalletHistory(Request $request)
    {
        $walletId = $request->route('wallet_id');

        $currencies = array_flip(Config::get('app.currencies'));

        $user = User::query()
            ->where('wallet_id', $walletId)
            ->firstOrFail();

        $transactions = Transaction::query()
            ->where('user_id', $user->id)
            ->with('payment')
            ->with('referral')
            ->paginate();

        $totalBalance = $transactions->sum('amount');

        return view('wallet-history', compact('transactions','currencies', 'totalBalance'));
    }

    public function getTransactionDetail(Request $request)
    {
        $transactionHash = $request->route('transaction_hash');

        $currencies = array_flip(Config::get('app.currencies'));

        $transaction = Transaction::query()
            ->where('transaction_hash', $transactionHash)
            ->with('payment')
            ->with('referral')
            ->firstOrFail();

        return view('transaction-detail', compact('transaction','currencies'));
    }

}
