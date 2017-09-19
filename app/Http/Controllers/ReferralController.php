<?php

namespace App\Http\Controllers;

use App\Domain\Referral\Referral;
use App\Domain\Transaction\Transaction;
use App\Mail\ReferFriend;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class ReferralController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth')->except('getReferralCode');
    }

    public function getRefer(Request $request)
    {
        $user = $request->user();

        $referrals = Referral::query()
            ->where('referral_code', $user->referral_code)
            ->get();
        //dd($referrals->pluck('referral_id'));

        $referralUserEarning = Transaction::query()
            ->whereIn('user_id', function($query) use($user) {
                $query->select('referral_id')->from('referrals')->where('user_id', $user->id)->distinct();
            })
            ->where('type', 'deposit')
            ->sum('amount');

        $referralEarning = Transaction::query()
            ->where('user_id', $user->id)
            ->where('type', 'referral')
            ->sum('amount');

        return view('referral.index', compact('user', 'referrals', 'referralEarning', 'referralUserEarning'));
    }

    public function postRefer(Request $request)
    {
        $user = $request->user();

        $emails = $request->input('emails');

        if (!is_string($emails)) {
            abort(404);
        }

        $emails = array_unique(array_filter(explode(',', str_replace(' ', '', $emails))));
        $validEmails = $invalidEmails = [];

        foreach ($emails as $email) {
            if (filter_var($email, FILTER_VALIDATE_EMAIL) !== false) {
                $validEmails[] = $email;
            } else {
                $invalidEmails[] = $email;
            }
        }

        foreach ($validEmails as $validEmail) {
            Mail::to($validEmail)->send(new ReferFriend($user));
        }

        if ($validEmails) {
            $emails = implode(', ', $validEmails);
            $request->session()->flash(
                'success',
                $emails
            );
        }

        if ($invalidEmails) {
            $emails = implode(', ', $invalidEmails);
            $request->session()->flash(
                'error',
                $emails
            );
        }

        return redirect()->back();
    }

    public function getReferralCode(Request $request)
    {
        if($request->user()) {
            return redirect()->route('get:home');
        }

        if(\Session::has('code')){
            return redirect('register');
        }

        $code = $request->route('code');
        \Session::put('code', $code);

        $user = User::query()
            ->where('referral_code', $code)
            ->first();

        if ($user) {
            $referral = new Referral();
            $referral->user_id = $user->id;
            $referral->referral_code = $user->referral_code;
            $referral->save();

            \Session::put('referral_id', $referral->id);
        }

        return redirect('register');
    }
}
