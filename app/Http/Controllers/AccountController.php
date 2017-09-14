<?php

namespace App\Http\Controllers;

use App\Domain\Referral\Referral;
use App\Notifications\EmailVerification;
use Illuminate\Http\Request;

class AccountController extends Controller
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

    public function getVerifyEmail(Request $request)
    {
        $user = $request->user();
        return view('account.verify-email', compact('user'));
    }

    public function getVerifyEmailLink(Request $request)
    {
        $user = $request->user();
        $user->email_token = str_random(32);
        $user->verified_email_at = NULL;
        $user->save();

        $user->notify(new EmailVerification($user));
        return redirect()->back()->with('success', 'Your verification email send successfully.');
    }
}
