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


                <form class="login-form">
                    <div class="form-group fg">
                        <label for="email">Email:</label>
                        <input type="email" class="form-control fc" id="email" placeholder="example@gmail.com" name="email">
                    </div>
                    <div class="form-group fg">
                        <label for="pwd">Password:</label>
                        <input type="password" class="form-control fc" id="pwd" placeholder="enter password" name="pwd">
                    </div>
                    <div class="forgot">
                        <a href="#">Forgot Password?</a>
                        <button type="submit" class="btn btn-default">Login</button>
                    </div>

                </form>

            <div class="line-form">
                <hr>
            </div>


            <div class="create-account clearfix">
                <a href="#">Don't Have account?</a>
                <a type="submit" class="btn btn-default reg">Register</a>
            </div>

        </div>
    </div>

</div>

@endsection