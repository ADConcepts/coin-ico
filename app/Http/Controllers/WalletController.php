<?php

namespace App\Http\Controllers;

use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use App\User;
use App\Domain\Transaction\Transaction;
use Yajra\DataTables\DataTables;

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

        return view('wallet-history', compact( 'totalBalance', 'walletId', 'user'));
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
            ->get();

        $total = $transactions->sum('amount');

        if ($transactions->isEmpty()) {
            throw (new ModelNotFoundException)->setModel(get_class($transactions), []);
        }

        $adminUser = User::query()
            ->where('is_admin', 1)
            ->where('id', 1)
            ->firstOrFail();

        return view('transaction-detail', compact('transactions', 'total', 'transactionHash', 'adminUser'));
    }

}
