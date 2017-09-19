<?php

namespace App\Http\Controllers;

use App\Domain\Transaction\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Config;

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
        $user = $request->user();

        $total = Transaction::query()
            ->where('user_id', $user->id)
            ->sum('amount');

        return view('home', compact('total'));
    }

    public function getHistory(Request $request)
    {
        $user = $request->user();
        $currencies = array_flip(Config::get('app.currencies'));

        $transactions = Transaction::query()
            ->where('user_id', $user->id)
            ->with('payment')
            ->with('referral')
            ->paginate();

        return view('history', compact('transactions','currencies'));
    }
}
