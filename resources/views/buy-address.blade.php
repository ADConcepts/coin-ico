@extends('layouts.app')
@section('content')
    <div class="container">
        <div class="row">
            <div class="col-md-8 col-md-offset-2">
                <div class="panel panel-default">
                    <div class="panel-heading">Your Address detail</div>
                    <div class="panel-body">
                        <strong>Currency:</strong>
                        {{ ucfirst($currency) }} <br/>
                        <strong>Address:</strong>
                        {{ $address->address }} <br/>
                        <strong>Expected coins: </strong>
                        1 {{ ucfirst($currency) }} =>  {{ round($exchangeRate->amount,2) }} $
                         <br/>
                        <strong>QR Code:</strong>
                        <img src="{{ $imageData }}" />
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection
