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

                        <form class="form-horizontal" method="POST" action="{{ route('post:refer') }}">
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
                        </form>

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

                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection
