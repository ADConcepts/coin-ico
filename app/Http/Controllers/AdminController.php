<?php

namespace App\Http\Controllers;


use App\Domain\Transaction\Transaction;
use App\User;
use Illuminate\Http\Request;
use Yajra\DataTables\DataTables;

class AdminController extends Controller
{
    public function getDashboard(Request $request)
    {
        $pageTitle = 'Dashboard';
        return view('admin.dashboard', compact('pageTitle'));
    }

    public function getUserList(Request $request)
    {
        $pageTitle = 'Users';
        return view('admin.users', compact('pageTitle'));
    }

    public function getUserJson(Request $request)
    {
        $users = User::all();

        return Datatables::of($users)
            ->addColumn('wallet_id', function ($user) {
                return '<a href="'.route("get:wallet:wallet_id", ["wallet_id" => $user->wallet_id]).'" target="_blank">'.$user->wallet_id.'</a>';
            })
            ->rawColumns(['wallet_id'])
            ->make(true);
    }

    public function getTransactionList(Request $request)
    {
        $pageTitle = 'Transactions';
        return view('admin.transactions', compact('pageTitle'));
    }

    public function getTransactionJson(Request $request)
    {
        $transactions = Transaction::all();

        return Datatables::of($transactions)
            ->addColumn('transaction_hash', function ($transaction) {
                return '<a href="'.route("get:transaction:transaction_hash", ["transaction_hash" => $transaction->transaction_hash]).'">'.$transaction->transaction_hash.'</a>';
            })
            ->rawColumns(['transaction_hash'])
            ->make(true);
    }

}
