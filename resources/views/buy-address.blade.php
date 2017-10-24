@extends('layouts.app')
@section('content')
    <div class="container">
        <div class="row">
            <div class="col-sm-12">
                <div class="select-currency">
                    <h1>Your Address detail</h1>

                    <hr>

                    <div class="row pb">

                        <div class="col-sm-9">
                        <strong>Currency:</strong>
                        {{ ucfirst($currency) }} <br/>
                        <strong>Address:</strong>
                        {{ $address->address }} <br/>
                        <strong>Expected coins: </strong>
                        1 {{ ucfirst($currency) }} =>  {{ round($exchangeRate->amount,2) }} coins
                         <br/>
                        </div>

                        <div class="col-sm-3">
                        <img src="{{ $imageData }}" class="img-responsive"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection
