@extends('layouts.app')

@section('content')
<div class="container">
    <div class="row">
        <div class="col-sm-12 ">
            <div class="">
               <div class="">Login</div>

                {{--<div class="panel-body">
                    <form class="form-horizontal" method="POST" action="{{ route('login') }}">
                        {{ csrf_field() }}

                        <div class="form-group{{ $errors->has('login') ? ' has-error' : '' }}">
                            <label for="email" class="col-md-4 control-label">E-Mail or Wallet Id.</label>

                            <div class="col-md-6">
                                <input id="login" type="text" class="form-control" name="login" value="{{ old('login') }}" required autofocus>

                                @if ($errors->has('login'))
                                    <span class="help-block">
                                        <strong>{{ $errors->first('login') }}</strong>
                                    </span>
                                @endif
                            </div>
                        </div>

                        <div class="form-group{{ $errors->has('password') ? ' has-error' : '' }}">
                            <label for="password" class="col-md-4 control-label">Password</label>

                            <div class="col-md-6">
                                <input id="password" type="password" class="form-control" name="password" required>

                                @if ($errors->has('password'))
                                    <span class="help-block">
                                        <strong>{{ $errors->first('password') }}</strong>
                                    </span>
                                @endif
                            </div>
                        </div>

                        <div class="form-group">
                            <div class="col-md-6 col-md-offset-4">
                                <div class="checkbox">
                                    <label>
                                        <input type="checkbox" name="remember" {{ old('remember') ? 'checked' : '' }}> Remember Me
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div class="form-group">
                            <div class="col-md-8 col-md-offset-4">
                                <button type="submit" class="btn btn-primary">
                                    Login
                                </button>

                                <a class="btn btn-link" href="{{ route('password.request') }}">
                                    Forgot Your Password?
                                </a>
                            </div>
                        </div>
                    </form>
                </div>--}}

                <div class="login-right">

                    <div class="form-login">

                        <h1>Login</h1>


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
        </div>
    </div>
</div>
@endsection
