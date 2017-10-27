<?php

namespace App\Http\Controllers;

use App\Domain\Transaction\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Config;
use Yajra\DataTables\DataTables;

class HomeController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function getIndex(Request $request)
    {
        $pageTitle = 'Home';
        return view('home', compact('pageTitle'));
    }

    public function getDashboard(Request $request)
    {
        $user = $request->user();

        $total = Transaction::query()
            ->where('user_id', $user->id)
            ->sum('amount');

        $pageTitle = 'Dashboard';
        return view('dashboard', compact('total', 'pageTitle'));
    }

    public function getHistory(Request $request)
    {
        $pageTitle = 'Transaction history';
        return view('history', compact('transactions', 'pageTitle'));
    }

    public function getHistoryDataTable(Request $request)
    {
        $user = $request->user();

        $transactions = Transaction::query()
            ->where('user_id', $user->id);

        return Datatables::of($transactions)
            ->addColumn('transaction_hash', function ($transaction) {
                return '<a href="'.route("get:transaction:transaction_hash", ["transaction_hash" => $transaction->transaction_hash]).'">'.$transaction->transaction_hash.'</a>';
            })
            ->rawColumns(['transaction_hash'])
            ->make(true);
    }
}
