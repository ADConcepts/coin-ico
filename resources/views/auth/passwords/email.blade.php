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

                <form class="login-form" method="POST" action="{{ route('password.email') }}">
                    {{ csrf_field() }}
                    <div class="form-group fg {{ $errors->has('email') ? ' has-error' : '' }}">
                        <label for="email" class="control-label">Email Address :</label>
                        <input type="text" class="form-control fc" id="email" placeholder="enter email" name="email" value="{{ old('email') }}">
                        @if ($errors->has('email'))
                            <span class="help-block">
                                <strong>{{ $errors->first('email') }}</strong>
                            </span>
                        @endif
                    </div>

                    <div class="forgot">
                        <button type="submit" class="btn btn-default">Send password reset link</button>
                    </div>

                </form>

            </div>
        </div>

    </div>
@endsection
