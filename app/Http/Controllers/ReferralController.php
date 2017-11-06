<?php

namespace App\Http\Controllers;

use App\Domain\Referral\Referral;
use App\Domain\Transaction\Transaction;
use App\Mail\ReferFriend;
use App\Notifications\ReferredByFriend;
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
        $this->middleware('auth')->except('getReferralCode', 'getSetReferralCode');
    }

    public function getRefer(Request $request)
    {
        $user = $request->user();

        $referrals = Referral::query()
            ->where('referral_code', $user->referral_code)
            ->get();

        $referralUserEarning = Transaction::query()
            ->whereIn('user_id', function ($query) use ($user) {
                $query->select('referral_id')->from('referrals')->where('user_id', $user->id)->distinct();
            })
            ->where('type', 'deposit')
            ->sum('amount');

        $referralEarning = Transaction::query()
            ->where('user_id', $user->id)
            ->where('type', 'referral')
            ->sum('amount');

        $pageTitle = 'Referral';
        return view('referral.index', compact('user', 'referrals', 'referralEarning', 'referralUserEarning', 'pageTitle'));
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

        $now = \Carbon\Carbon::now()->toDateTimeString();
        foreach ($validEmails as $validEmail) {
            $referral = new Referral();
            $referral->user_id = $user->id;
            $referral->referral_id = NULL;
            $referral->email = $validEmail;
            $referral->referral_code = $user->referral_code;
            $referral->registered_at = NULL;
            $referral->first_buy_at = NULL;
            $referral->created_at = $now;
            $referral->updated_at = $now;
            $referral->save();
            $referral->notify(new ReferredByFriend($user));
        }

        if ($validEmails) {
            $emails = implode(', ', $validEmails);
            $request->session()->flash(
                'success',
                'Referred ' . $emails
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
        if ($request->user()) {
            return redirect()->route('get:home');
        }

        if (\Session::has('code')) {
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

    public function getSetReferralCode(Request $request)
    {
        $code = $request->route('code');

        $user = User::query()
            ->where('referral_code', $code)
            ->first();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid referral code!',
            ]);
        }

        \Session::put('code', $code);

        $referral = new Referral();
        $referral->user_id = $user->id;
        $referral->referral_code = $user->referral_code;
        $referral->save();

        \Session::put('referral_id', $referral->id);

        return response()->json([
            'success' => true,
            'message' => 'Referral code applied successfully!'
        ]);
    }
}
