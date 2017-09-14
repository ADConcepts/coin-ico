@extends('layouts.app')
@section('content')
    <div class="container">
        <div class="row">
            <div class="col-md-8 col-md-offset-2">
                <div class="panel panel-default">
                    <div class="panel-heading">Your Address detail</div>
                    <div class="panel-body">
                        <strong>Selected Currency:</strong>
                        {{ ucfirst($currency) }} <br/>
                        <strong>Address:</strong>
                        {{ $address->address }} <br/>
                        <strong>Exchange Rate: </strong>
                        {{ config('coinbase.exchangeRate')[$currency] }}<br/>
                        <strong>Expected coins: </strong>
                        {{ $exchangeRate->amount }}
                         <br/>
                        <strong>QR Code:</strong>
                        <img src="{{ $imageData }}" />
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection
