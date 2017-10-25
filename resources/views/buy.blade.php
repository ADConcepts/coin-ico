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
                                            <div class="coin-icon">
                                                <i class="fa fa-btc fa-5x"></i>
                                            </div>
                                            <div class="coin-name">
                                                <h3>Bitcoin</h3>
                                            </div>
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
                                            <div class="coin-icon">
                                                <i class="fa fa-ltc fa-5x"></i>
                                            </div>
                                            <div class="coin-name">
                                                <h3>Litecoin</h3>
                                            </div>
                                        </div>
                                    </div>
                                    <a href="{{ route('get:buy',['currency' => 'litecoin']) }}">
                                        {{--<div class="panel-footer">
                                            <span class="pull-left">Buy Now</span>
                                            <span class="pull-right"><i class="fa fa-arrow-circle-right"></i></span>
                                            <div class="clearfix"></div>
                                        </div>--}}

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
                                            <div class="coin-icon">
                                                <i class="fa fa-btc fa-5x"></i>
                                            </div>
                                            <div class="coin-name">
                                                <h3>Ethereum</h3>
                                            </div>
                                        </div>
                                    </div>
                                    <a href="{{ route('get:buy',['currency' => 'ethereum']) }}">
                                        {{--<div class="panel-footer">
                                            <span class="pull-left">Buy Now</span>
                                            <span class="pull-right"><i class="fa fa-arrow-circle-right"></i></span>
                                            <div class="clearfix"></div>
                                        </div>--}}

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
