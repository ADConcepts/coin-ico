@extends('layouts.app')

@section('content')
    <div class="container">
        <div class="row">
            <div class="col-sm-12">
                <div class="select-currency">
                    <h1>Registration Confirmed!</h1>

                    <hr>

                    <div class="pb">
                        <h2 class="text-center admin-welcome">Congratulations!</h2>
                        <h4 class="text-center"><strong>Your Email is successfully verified.</strong></h4>
                        <a href="{{route('get:home')}}" class="back-home pull-right">Home <i class="fa fa-long-arrow-right"></i> </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection