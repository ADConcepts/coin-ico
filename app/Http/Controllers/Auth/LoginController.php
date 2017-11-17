<?php

namespace App\Http\Controllers\Auth;

use App\User;
use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\AuthenticatesUsers;
use Illuminate\Http\Request;

class LoginController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Login Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles authenticating users for the application and
    | redirecting them to your home screen. The controller uses a trait
    | to conveniently provide its functionality to your applications.
    |
    */

    use AuthenticatesUsers;

    /**
     * Where to redirect users after login.
     *
     * @var string
     */
    protected $redirectTo = '/dashboard';

    protected $username = 'email';

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('guest')->except('logout');
    }

    public function loginWalletOrEmail(Request $request)
    {
        $field = filter_var($request->input('login'), FILTER_VALIDATE_EMAIL) ? 'email' : 'wallet_id';

        $request->merge([$field => $request->input('login')]);

        $this->username = $field;

        return $this->login($request);
    }

    public function username()
    {
        return $this->username;
    }

    /**
     * Get the failed login response instance.
     *
     * @param  \Illuminate\Http\Request $request
     * @return \Illuminate\Http\RedirectResponse
     */
    protected function sendFailedLoginResponse(Request $request)
    {
        $errors = ['login' => trans('auth.failed')];

        if ($request->expectsJson()) {
            return response()->json($errors, 422);
        }

        return redirect()->back()
            ->withInput($request->only('login', 'remember'))
            ->withErrors($errors);
    }

    public function showLoginForm() {
        $pageTitle = 'Login';
        return view ('auth.login', compact('pageTitle'));
    }

    protected function validateLogin(Request $request)
    {
        \Validator::extend('without_spaces', function($attr, $value){
            return preg_match('/^\S{1,}\z/', $value);
        });

        $this->validate($request, [
            $this->username() => 'required|without_spaces',
            'password' => 'required',
        ], [
            $this->username().'.required' => 'Email or wallet id or username field is required.',
            $this->username().'.without_spaces' => "Invalid character entered."
        ]);
    }

    public function login(Request $request)
    {
        $this->validateLogin($request);

        if ($this->hasTooManyLoginAttempts($request)) {
            $this->fireLockoutEvent($request);
            return $this->sendLockoutResponse($request);
        }

        $credentials = $this->credentials($request);

        if (!\Auth::attempt($credentials, false, false)) {
            $credentials['name'] = $credentials[$this->username()];
            unset($credentials[$this->username()]);
            $this->username = 'name';
            $request->merge([$this->username => $request->input('login')]);
        }

        if ($this->attemptLogin($request)) {
            return $this->sendLoginResponse($request);
        }

        $this->incrementLoginAttempts($request);

        return $this->sendFailedLoginResponse($request);
    }

    public function credentials(Request $request)
    {
        return $request->only($this->username(), 'password');
    }

}
