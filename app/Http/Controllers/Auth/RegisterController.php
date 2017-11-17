<?php

namespace App\Http\Controllers\Auth;

use App\Domain\Country\Country;
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
    protected $redirectTo = '/dashboard';

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
        Validator::extend('without_spaces', function($attr, $value){
            return preg_match('/^[a-z0-9-]+$/', $value);
        });

        return Validator::make($data, [
            'name' => 'required|string|max:255|without_spaces|unique:users',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6|confirmed',
            'residence_country_id' => 'required|integer',
            'birth_country_id' => 'required|integer',
        ],[
            'name.without_spaces' => 'The username must be in lowercase without any spaces.',
            'residence_country_id.required' => "The residence country is required.",
            'birth_country_id.required' => "The nationality is required."
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
        $now = \Carbon\Carbon::now()->toDateTimeString();

        if(\Session::has('code') && \Session::has('referral_id')){
            $code = \Session::get('code');
            $referralId = \Session::get('referral_id');

            $referral = Referral::query()
                ->where('referral_code',$code)
                ->where('id',$referralId)
                ->first();

            if($referral) {
                $referral->referral_id = $user->id;
                $referral->email = $user->email;
                $referral->registered_at = $now;
                $referral->save();
            }
        } else {
            $adminEmails = config('app.adminEmails');
            $adminUser = User::query()->whereIn('email', $adminEmails)->first();
            $referral = new Referral();
            $referral->user_id = $adminUser->id;
            $referral->referral_id = $user->id;
            $referral->email = $user->email;
            $referral->referral_code = $adminUser->referral_code;
            $referral->registered_at = $now;
            $referral->first_buy_at = NULL;
            $referral->created_at = $now;
            $referral->updated_at = $now;
            $referral->save();
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
            'residence_country_id' => $data['residence_country_id'],
            'birth_country_id' => $data['birth_country_id'],
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

    public function showRegistrationForm() {
        $countries = Country::all();
        $pageTitle = 'Register';
        return view ('auth.register', compact('countries', 'pageTitle'));
    }
}
