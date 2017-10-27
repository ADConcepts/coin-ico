<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('home');
});

Auth::routes();
Route::post('login', 'Auth\LoginController@loginWalletOrEmail');

Route::get('/confirm/email/{token}', 'Auth\RegisterController@getConfirmEmail')->name('get:user:confirm:email');

Route::get('/verify/email', 'AccountController@getVerifyEmail')->name('get:user:verify:email');
Route::get('/verify/email/link', 'AccountController@getVerifyEmailLink')->name('get:user:verify:email:link');

Route::get('/home', 'HomeController@getIndex')->name('get:home');
Route::get('/dashboard', 'HomeController@getDashboard')->name('get:dashboard');
Route::get('/historyData/', 'HomeController@getHistoryDataTable')->name('get:history:data-table');
Route::get('/history', 'HomeController@getHistory')->name('get:history');

Route::get('/buy', 'BuyController@getBuy')->name('get:buy')->middleware(['auth','verify-email']);

Route::get('/r/{code}', 'ReferralController@getReferralCode')->name('get:referral:code');
Route::get('/refer', 'ReferralController@getRefer')->name('get:refer');
Route::post('/refer', 'ReferralController@postRefer')->name('post:refer');

Route::get('/walletData/{wallet_id}', 'WalletController@getWalletDataTable')->name('get:wallet:data-table');
Route::get('/wallet/{wallet_id}', 'WalletController@getWalletHistory')->name('get:wallet:wallet_id');

Route::get('/transaction/{transaction_hash}', 'WalletController@getTransactionDetail')->name('get:transaction:transaction_hash');

Route::get('/commands', function () {
    Artisan::call('exchange:rates');
    dd(Artisan::output());
});

Route::get('/frontend/{any}', function (\Illuminate\Http\Request $request) {
    return view(implode('.', explode('/', $request->path())));
})->where('any', '.*');
