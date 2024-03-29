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
})->name('home');

Auth::routes();
Route::post('login', 'Auth\LoginController@loginWalletOrEmail');

Route::get('/confirm/email/{token}', 'Auth\RegisterController@getConfirmEmail')->name('get:user:confirm:email');

Route::get('/verify/email', 'AccountController@getVerifyEmail')->name('get:user:verify:email');
Route::get('/verify/email/link', 'AccountController@getVerifyEmailLink')->name('get:user:verify:email:link');

Route::get('/home', 'HomeController@getIndex')->name('get:home');
Route::get('/dashboard', 'HomeController@getDashboard')->name('get:dashboard');
Route::get('/historyData/', 'HomeController@getHistoryDataTable')->name('get:history:data-table');
Route::get('/history', 'HomeController@getHistory')->name('get:history');
Route::get('/polls', 'HomeController@getPolls')->name('get:polls');

Route::get('/buy', 'BuyController@getBuy')->name('get:buy')->middleware(['auth','verify-email']);
Route::get('/buyNow', 'BuyController@getBuyNow')->name('get:buy-now')->middleware(['auth','verify-email']);

Route::get('/r/{code}', 'ReferralController@getReferralCode')->name('get:referral:code');
Route::get('/refer', 'ReferralController@getRefer')->name('get:refer');
Route::post('/refer', 'ReferralController@postRefer')->name('post:refer');
Route::get('/refer/{code}', 'ReferralController@getSetReferralCode')->name('get:set-referral:code');

Route::get('/walletData/{wallet_id}', 'WalletController@getWalletDataTable')->name('get:wallet:data-table');
Route::get('/wallet/{wallet_id}', 'WalletController@getWalletHistory')->name('get:wallet:wallet_id');

Route::get('/transaction/{transaction_hash}', 'WalletController@getTransactionDetail')->name('get:transaction:transaction_hash');

Route::get('/terms', 'WalletController@getTermsOfConditions')->name('get:terms');
Route::get('/whitepaper', 'WalletController@getWhitePaper')->name('get:white-paper');
Route::get('/whitepaper/download/{fileName}', 'WalletController@getWhitePaperDownload')->name('get:white-paper:download');

Route::get('/commands', function () {
    Artisan::call('exchange:rates');
    dd(Artisan::output());
});

Route::get('/frontend/{any}', function (\Illuminate\Http\Request $request) {
    return view(implode('.', explode('/', $request->path())));
})->where('any', '.*');

Route::group(['middleware' => ['auth', 'admin'], 'prefix' => 'admin'], function () {
    Route::get('/', 'AdminController@getDashboard')->name('get:dashboard:admin');

    Route::get('/users', 'AdminController@getUserList')->name('get:users:list');
    Route::get('/users/json', 'AdminController@getUserJson')->name('get:users:json');

    Route::get('/transactions', 'AdminController@getTransactionList')->name('get:transactions:list');
    Route::get('/transactions/json', 'AdminController@getTransactionJson')->name('get:transactions:json');

    Route::get('/referrals', 'AdminController@getReferralList')->name('get:referrals:list');
    Route::get('/referrals/json', 'AdminController@getReferralJson')->name('get:referrals:json');
});
