@extends('layouts.site')

@section('content')

    <div class="login-main">

        <div class="login-left">
            <div class="left-vpad">
                <h1>Crypted United</h1>

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
                    <div class="form-group fg {{ $errors->has('login') ? ' has-error' : '' }}">
                        <label for="email">E-Mail or Wallet Id:</label>
                        <input type="text" class="form-control fc" id="login" placeholder="email or wallet Id." name="login" value="{{ old('login') }}">
                        @if ($errors->has('login'))
                            <span class="help-block">
                                <strong>{{ $errors->first('login') }}</strong>
                            </span>
                        @endif
                    </div>
                    <div class="form-group fg {{ $errors->has('password') ? ' has-error' : '' }}">
                        <label for="pwd">Password:</label>
                        <input type="password" class="form-control fc" id="pwd" placeholder="enter password" name="password">
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
                    <a href="#">Don't Have account?</a>
                    <a href="{{ route('register') }}" class="btn btn-default reg">Register</a>
                </div>

            </div>
        </div>

    </div>

@endsection