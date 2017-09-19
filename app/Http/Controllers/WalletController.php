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
            ->first();

        $transactions = Transaction::query()
            ->where('user_id', $user->id)
            ->with('payment')
            ->with('referral')
            ->paginate();

        $totalBalance = $transactions->sum('amount');

        return view('wallet-history', compact('transactions','currencies', 'totalBalance'));
    }

}
