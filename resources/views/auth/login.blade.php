@extends('layouts.site')

@section('content')

    <div class="login-main">

        <div class="login-left">
            <div class="left-vpad">
                <a href="{{ route('home') }}"><h1>Crypted United</h1></a>

                <p>Shape the future, <br>
                    Own the company, <br>
                    Be the change</p>
            </div>
        </div>

        <div class="login-right">

            <div class="form-login">

                <h1>Welcome</h1>

                <form class="login-form" method="POST" action="{{ route('login') }}">
                    {{ csrf_field() }}
                    <div class="form-group fg {{ ($errors->has('login') || $errors->has('wallet_id')) ? ' has-error' : '' }}">
                        <label for="email" class="control-label">E-Mail or Wallet Id:</label>
                        <input type="text" class="form-control fc" id="login" placeholder="Email or Wallet Id." name="login" value="{{ old('login') }}">
                        @if ($errors->has('login'))
                            <span class="help-block">
                                <strong>{{ $errors->first('login') }}</strong>
                            </span>
                        @endif
                        @if ($errors->has('wallet_id'))
                            <span class="help-block">
                                <strong>{{ $errors->first('wallet_id') }}</strong>
                            </span>
                        @endif
                    </div>
                    <div class="form-group fg {{ $errors->has('password') ? ' has-error' : '' }}">
                        <label for="pwd" class="control-label">Password:</label>
                        <input type="password" class="form-control fc" id="pwd" placeholder="Enter Password" name="password">
                        @if ($errors->has('password'))
                            <span class="help-block">
                                <strong>{{ $errors->first('password') }}</strong>
                            </span>
                        @endif
                    </div>
                    <div class="forgot">
                        <a href="{{ route('password.request') }}">Forgot Password?</a>
                        <button type="submit" class="btn btn-default">Login</button>
                    </div>

                </form>

                <div class="line-form">
                    <hr>
                </div>


                <div class="create-account clearfix">
                    <a href="javascript:void(0)">Don't Have account?</a>
                    <a href="{{ route('register') }}" class="btn btn-default reg">Register</a>
                </div>

            </div>
        </div>

    </div>

@endsection