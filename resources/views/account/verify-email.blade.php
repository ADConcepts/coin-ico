@extends('layouts.app')

@section('content')
    <div class="container">
        <div class="row">
            <div class="col-md-8 col-md-offset-2">
                <div class="panel panel-default">
                    <div class="panel-heading">Email not verified!</div>
                    <div class="panel-body">
                        @if (session('success'))
                            <div class="alert alert-success">
                                {{ session('success') }}
                            </div>
                        @endif
                        <p>Please verify your email.</p>
                        <a href="{{ route('get:user:verify:email:link') }}">Click here </a> to resend verification link.
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection