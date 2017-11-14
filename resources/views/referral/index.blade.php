@extends('layouts.app')
@section('content')
    <div class="container">
        <div class="row">
            <div class="col-sm-12">
                <div class="select-currency">
                    <h1>Refer a friend</h1>
                    <hr>
                    <div class="pb col-sm-8 col-sm-offset-2">
                        @if (session('success'))
                            <div class="alert alert-success">
                                {{ session('success') }}
                            </div>
                        @endif
                        @if (session('error'))
                            <div class="alert alert-danger">
                                {{ session('error') }}
                            </div>
                        @endif

                        <div class="well">{{ route('get:referral:code', $user->referral_code) }}</div>

                        {{--<form class="form-horizontal" method="POST" action="{{ route('post:refer') }}">
                            {{ csrf_field() }}

                            <div class="form-group{{ $errors->has('emails') ? ' has-error' : '' }}">
                                <label for="emails" class="col-sm-12">Emails:   </label>

                                <div class="col-sm-12">
                                    <textarea type="text" class="form-control fc1" name="emails" required autofocus>{{ old('emails') }}</textarea>
                                    <span class="help-block">Please use (,) to seperate multiple emails.</span>
                                    @if ($errors->has('emails'))
                                        <span class="help-block">
                                        <strong>{{ $errors->first('emails') }}</strong>
                                    </span>
                                    @endif
                                </div>
                            </div>

                            <div class="form-group">
                                <div class="col-sm-12 forgot-btn">
                                    <button type="submit" class="btn btn-default">
                                        Submit
                                    </button>
                                </div>
                            </div>
                        </form>--}}

                        <div class="table-responsive">
                            <table class="table table-bordered">
                                <tr class="tabel-heading">
                                    <th>Total referred</th>
                                    <th>Coins the referrals bought</th>
                                    <th>Referral credit</th>
                                </tr>
                                <tr>
                                    <td> {{ $referrals->count() }} </td>
                                    <td> {{ $referralUserEarning }} </td>
                                    <td> {{ $referralEarning }} </td>
                                </tr>
                            </table>
                        </div>

                        <div class="col-md-12">
                            <img src="https://i.imgur.com/CBcOCod.png" alt="CryptedUnited" width="728" height="90"/>
                        </div>
                        <div class="col-md-12 crypted-images">
                            <img src="https://i.imgur.com/iMQTnOl.png" alt="CryptedUnited" width="300" height="600"/>
                            <img src="https://i.imgur.com/ci0RbGs.png" alt="CryptedUnited" width="300" height="250"/>
                            <img src="https://i.imgur.com/aSG0NPa.png" alt="CryptedUnited" width="300" height="250"/>
                            <img src="https://i.imgur.com/qX39SiU.png" alt="CryptedUnited" width="300" height="250"/>
                            <img src="https://i.imgur.com/STd6PfP.png" alt="CryptedUnited" width="300" height="250"/>
                            <img src="https://i.imgur.com/4sCWctX.png" alt="CryptedUnited" width="300" height="250"/>
                            <img src="https://i.imgur.com/CQdZlrY.png" alt="CryptedUnited" width="336" height="280"/>
                            <img src="https://i.imgur.com/2y0J3yU.png" alt="CryptedUnited" width="336" height="280"/>
                            <img src="https://i.imgur.com/WoLGokh.png" alt="CryptedUnited" width="336" height="280"/>
                            <img src="https://i.imgur.com/lPoPvzK.png" alt="CryptedUnited" width="336" height="280"/>
                            <img src="https://i.imgur.com/3Mvvlob.png" alt="CryptedUnited" width="336" height="280"/>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </div>
    <style>
        .crypted-images {
            -webkit-column-count: 3; /* Chrome, Safari, Opera */
            -moz-column-count: 3; /* Firefox */
            column-count: 3;
            margin-top: 7px;
        }
        .crypted-images img{ width: 100%; padding: 7px 0;}
        @media (max-width: 500px) {
            .crypted-images {
                -webkit-column-count: 1; /* Chrome, Safari, Opera */
                -moz-column-count: 1; /* Firefox */
                column-count: 1;
            }
        }
    </style>
@endsection
