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

                <h1>Reset Password</h1>


                <form class="login-form" method="POST" action="{{ route('password.request') }}">
                    {{ csrf_field() }}
                    <div class="form-group fg {{ $errors->has('login') ? ' has-error' : '' }}">
                        <label for="email">Email Address :</label>
                        <input type="text" class="form-control fc" id="login" placeholder="enter email" name="login" value="{{ old('login') }}">
                        @if ($errors->has('login'))
                            <span class="help-block">
                                <strong>{{ $errors->first('login') }}</strong>
                            </span>
                        @endif
                    </div>


                    <div class="forgot">
                       {{-- <a href="{{ route('password.request') }}">Forgot Password?</a>--}}
                        <button type="submit" class="btn btn-default">send password reset link</button>
                    </div>

                </form>


            </div>
        </div>

    </div>
@endsection
