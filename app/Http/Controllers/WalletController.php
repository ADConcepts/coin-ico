<?php

namespace App\Http\Controllers;

use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use App\User;
use App\Domain\Transaction\Transaction;
use Yajra\DataTables\DataTables;
use Illuminate\Support\Facades\Config;

class WalletController extends Controller
{

    public function getWalletHistory(Request $request)
    {
        $walletId = $request->route('wallet_id');

        $user = User::query()
            ->where('wallet_id', $walletId)
            ->firstOrFail();

        $transactions = Transaction::query()
            ->where('user_id', $user->id)
            ->sum('amount');

        $totalBalance = $transactions;

        $pageTitle = 'Wallet history';

        return view('wallet-history', compact( 'totalBalance', 'walletId', 'user', 'pageTitle'));
    }

    public function getWalletDataTable(Request $request)
    {
        $walletId = $request->route('wallet_id');

        $user = User::query()
            ->where('wallet_id', $walletId)
            ->firstOrFail();

        if ($user->id == 1 && $user->is_admin) {
            $transactions = Transaction::query()
                ->where('sender_id', $user->id);
        } else {
            $transactions = Transaction::query()
                ->where('user_id', $user->id);
        }

        return Datatables::of($transactions)
            ->addColumn('transaction_hash', function ($transaction) {
                return '<a href="'.route("get:transaction:transaction_hash", ["transaction_hash" => $transaction->transaction_hash]).'">'.$transaction->transaction_hash.'</a>';
            })
            ->rawColumns(['transaction_hash'])
            ->make(true);
    }

    public function getTransactionDetail(Request $request)
    {
        $transactionHash = $request->route('transaction_hash');

        $transactions = Transaction::query()
            ->where('transaction_hash', $transactionHash)
            ->with('user')
            ->with('payment')
            ->get();

        $paymentTransaction = array_first($transactions);
        $currencies = Config::get('app.currencies');
        $transactionCurrency = array_search($paymentTransaction->payment->currency, $currencies);
        $transactionExchangeRate = $paymentTransaction->payment->exchange_rate;

        $total = $transactions->sum('amount');

        if ($transactions->isEmpty()) {
            throw (new ModelNotFoundException)->setModel(get_class($transactions), []);
        }

        $adminUser = User::query()
            ->where('is_admin', 1)
            ->where('id', 1)
            ->firstOrFail();

        $pageTitle = 'Transaction detail';

        $bonusTransaction = false;

        return view('transaction-detail', compact('transactions', 'total', 'transactionHash', 'adminUser', 'pageTitle', 'transactionCurrency', 'transactionExchangeRate', 'paymentTransaction', 'bonusTransaction'));
    }

    public function getTermsOfConditions()
    {
        $pageTitle = 'Terms of Service';
        return view('terms', compact('pageTitle'));
    }

    public function getWhitePaper()
    {
        $pageTitle = 'White paper';
        return view('white-paper', compact('pageTitle'));
    }

}
