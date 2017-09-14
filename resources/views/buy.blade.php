@extends('layouts.app')
<style>
    .fa-ltc:before {
        content: "Ł";
        font-weight:bold;
    }
</style>
@section('content')
    <div class="container">
        <div class="row">
            <div class="col-md-8 col-md-offset-2">
                <div class="panel panel-default">
                    <div class="panel-heading">Select Currency</div>

                    <div class="panel-body">
                        <div class="row">
                            <div class="col-lg-4 col-md-4 col-sm-4">
                                <div class="panel panel-primary">
                                    <div class="panel-heading">
                                        <div class="row">
                                            <div class="col-xs-3">
                                                <i class="fa fa-btc fa-5x"></i>
                                            </div>
                                            <div class="col-xs-9 text-right">
                                                <h3>Bitcoin</h3>
                                            </div>
                                        </div>
                                    </div>
                                    <a href="{{ route('get:buy',['currency' => 'bitcoin']) }}">
                                        <div class="panel-footer">
                                            <span class="pull-left">Buy Now</span>
                                            <span class="pull-right"><i class="fa fa-arrow-circle-right"></i></span>
                                            <div class="clearfix"></div>
                                        </div>
                                    </a>
                                </div>
                            </div>
                            <div class="col-lg-4 col-md-4 col-sm-4">
                                <div class="panel panel-primary">
                                    <div class="panel-heading">
                                        <div class="row">
                                            <div class="col-xs-3">
                                                <i class="fa fa-ltc fa-5x"></i>
                                            </div>
                                            <div class="col-xs-9 text-right">
                                                <h3>Litecoin</h3>
                                            </div>
                                        </div>
                                    </div>
                                    <a href="{{ route('get:buy',['currency' => 'litecoin']) }}">
                                        <div class="panel-footer">
                                            <span class="pull-left">Buy Now</span>
                                            <span class="pull-right"><i class="fa fa-arrow-circle-right"></i></span>
                                            <div class="clearfix"></div>
                                        </div>
                                    </a>
                                </div>
                            </div>
                            <div class="col-lg-4 col-md-4 col-sm-4">
                                <div class="panel panel-primary">
                                    <div class="panel-heading">
                                        <div class="row">
                                            <div class="col-xs-3">
                                                <i class="fa fa-btc fa-5x"></i>
                                            </div>
                                            <div class="col-xs-9 text-right">
                                                <h3>Ethereum</h3>
                                            </div>
                                        </div>
                                    </div>
                                    <a href="{{ route('get:buy',['currency' => 'ethereum']) }}">
                                        <div class="panel-footer">
                                            <span class="pull-left">Buy Now</span>
                                            <span class="pull-right"><i class="fa fa-arrow-circle-right"></i></span>
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
