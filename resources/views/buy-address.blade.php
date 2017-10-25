@extends('layouts.app')
@section('content')
    <div class="container">
        <div class="row">
            <div class="col-sm-12">
                <div class="select-currency">
                    <h1>Your Address detail</h1>

                    <hr>

                    <div class="row">

                        <div class="col-sm-9">

                            <div class="pb">

                        <div class="current-detail">
                        <strong class="currency">Currency:</strong>
                        <span>{{ ucfirst($currency) }} </span>
                        </div>


                        <div class="current-detail">
                        <strong class="currency">Address:</strong>
                        <span>{{ $address->address }} </span>
                        </div>

                        <div class="current-detail">
                        <strong class="currency">Expected coins: </strong>
                        <span>1 {{ ucfirst($currency) }} =>  {{ round($exchangeRate->amount,2) }} coins</span>
                        </div>

                            </div>

                        </div>

                        <div class="col-sm-3">

                            <div class="barcoad">
                                <img src="{{ $imageData }}" class="img-responsive"/>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection
