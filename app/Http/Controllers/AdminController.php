<?php

namespace App\Http\Controllers;


use App\Domain\Referral\Referral;
use App\Domain\Transaction\Transaction;
use App\User;
use Illuminate\Http\Request;
use Yajra\DataTables\DataTables;

class AdminController extends Controller
{
    public function getDashboard(Request $request)
    {
        $pageTitle = 'Dashboard';
        $totalUsers = User::count();
        $totalTransactions = Transaction::count();
        $totalReferrals = Referral::query()
            ->whereNotNull('referral_id')
            ->count();
        return view('admin.dashboard', compact('pageTitle', 'totalUsers', 'totalTransactions', 'totalReferrals'));
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

    public function getReferralList(Request $request)
    {
        $pageTitle = 'Referrals';
        return view('admin.referrals', compact('pageTitle'));
    }

    public function getReferralJson(Request $request)
    {
        $users = User::query()
            ->select('users.id', 'users.name', 'users.email', \DB::raw('COUNT(referrals.id) AS total_referred'), \DB::raw('SUM(transactions.amount) AS referral_credit'))
            ->leftJoin('referrals', 'referrals.user_id', '=', 'users.id')
            ->leftJoin('transactions', function($join) {
                $join->on('transactions.user_id', '=', 'users.id')
                    ->where('transactions.type', '=', 'referral');
            })
            ->groupBy('users.id')
            ->get();

        return Datatables::of($users)
            ->addIndexColumn()
            ->addColumn('referral_credit', function ($user) {
                return !empty($user->referral_credit) ? $user->referral_credit : 0;
            })
            ->rawColumns(['referral_credit'])
            ->make(true);
        
    }
}
