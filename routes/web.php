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
    return view('welcome');
});

Auth::routes();
Route::post('login', 'Auth\LoginController@loginWalletOrEmail');
Route::get('/confirm/email/{token}', 'Auth\RegisterController@getConfirmEmail')->name('get:user:confirm:email');
Route::get('/verify/email', 'AccountController@getVerifyEmail')->name('get:user:verify:email');
Route::get('/verify/email/link', 'AccountController@getVerifyEmailLink')->name('get:user:verify:email:link');

Route::get('/home', 'HomeController@index')->name('home');
Route::get('/buy', 'BuyController@getBuy')->name('get:buy')->middleware(['auth','verify-email']);

Route::get('/r/{code}', 'ReferralController@getReferralCode')->name('get:referral:code');
Route::get('/refer', 'ReferralController@getRefer')->name('get:refer');
Route::post('/refer', 'ReferralController@postRefer')->name('post:refer');

Route::get('/commands', function () {
    Artisan::call('exchange:rates');
    dd(Artisan::output());
});
