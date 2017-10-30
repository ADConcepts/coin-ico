@extends('layouts.app')
<style>
    .fa-ltc:before {
        content: "Ł";
        font-weight: bold;
    }
</style>
@section('content')
    <div class="container">
        <div class="row">
            <div class="col-sm-12">
                <div class="select-currency">
                    <h1 class="">Select Currency</h1>

                    <hr>

                    <div class="pb">
                        <div class="row">
                            <div class="col-lg-4 col-md-4 col-sm-4 col-half">
                                <div class="buy1">
                                    <div class="panel-heading ph">
                                        <div class="inner-ph">
                                            <img src="/images/bit_coin.png" class="img-responsive">
                                        </div>
                                    </div>
                                    <a href="{{ route('get:buy',['currency' => 'bitcoin']) }}">
                                        <div class="buy-now text-center">
                                            <button type="button">Buy Now</button>

                                            <div class="clearfix"></div>
                                        </div>
                                    </a>
                                </div>
                            </div>
                            <div class="col-lg-4 col-md-4 col-sm-4 col-half">
                                <div class="buy1">
                                    <div class="panel-heading ph">
                                        <div class="inner-ph">
                                            <img src="/images/litecoin.png" class="img-responsive">
                                        </div>
                                    </div>
                                    <a href="{{ route('get:buy',['currency' => 'litecoin']) }}">
                                        <div class="buy-now text-center">
                                            <button type="button">Buy Now</button>

                                            <div class="clearfix"></div>
                                        </div>
                                    </a>
                                </div>
                            </div>
                            <div class="col-lg-4 col-md-4 col-sm-4 col-half">
                                <div class="buy1">
                                    <div class="panel-heading ph">
                                        <div class="inner-ph">
                                            <img src="/images/ethereum.png" class="img-responsive">
                                        </div>
                                    </div>
                                    <a href="{{ route('get:buy',['currency' => 'ethereum']) }}">
                                        <div class="buy-now text-center">
                                            <button type="button">Buy Now</button>

                                            <div class="clearfix"></div>
                                        </div>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection
