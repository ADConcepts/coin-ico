<?php

namespace App\Http\Controllers\Auth;

use App\Domain\Referral\Referral;
use App\Notifications\EmailVerification;
use App\User;
use App\Http\Controllers\Controller;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Foundation\Auth\RegistersUsers;

class RegisterController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Register Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles the registration of new users as well as their
    | validation and creation. By default this controller uses a trait to
    | provide this functionality without requiring any additional code.
    |
    */

    use RegistersUsers;

    /**
     * Where to redirect users after registration.
     *
     * @var string
     */
    protected $redirectTo = '/home';

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('guest')->except('getConfirmEmail');
    }

    /**
     * Get a validator for an incoming registration request.
     *
     * @param  array $data
     * @return \Illuminate\Contracts\Validation\Validator
     */
    protected function validator(array $data)
    {
        return Validator::make($data, [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6|confirmed',
        ]);
    }

    /**
     * Handle a registration request for the application.
     *
     * @param  \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function register(Request $request)
    {

        $this->validator($request->all())->validate();

        event(new Registered($user = $this->create($request->all())));

        $this->guard()->login($user);

        if(\Session::has('code') && \Session::has('referral_id')){
            $code = \Session::get('code');
            $referralId = \Session::get('referral_id');

            $referral = Referral::query()
                ->where('referral_code',$code)
                ->where('id',$referralId)
                ->first();

            if($referral) {
                $now = \Carbon\Carbon::now()->toDateTimeString();
                $referral->referral_id = $user->id;
                $referral->email = $user->email;
                $referral->registered_at = $now;
                $referral->save();
            }
        }

        $user->notify(new EmailVerification($user));

        return $this->registered($request, $user)
            ?: redirect($this->redirectPath());

    }

    /**
     * Create a new user instance after a valid registration.
     *
     * @param  array $data
     * @return \App\User
     */
    protected function create(array $data)
    {
        return User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => bcrypt($data['password']),
            'email_token' => str_random(32),
            'wallet_id' => str_random(34),
            'referral_code' => substr(md5(microtime()), rand(0, 26), 5)
        ]);

    }

    public function getConfirmEmail(Request $request)
    {
        $token = $request->route('token');
        $user = User::where('email_token', $token)->first();
        if ($user) {
            $now = \Carbon\Carbon::now()->toDateTimeString();
            $user->email_verified = true;
            $user->email_token = NULL;
            $user->verified_email_at = $now;
            if ($user->save()) {
                return view('auth.emailconfirm', ['user' => $user]);
            }
        }
        $route = route('get:home');
        return redirect($route);
    }
}
