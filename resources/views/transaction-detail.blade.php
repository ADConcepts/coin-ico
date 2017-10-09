@extends('layouts.app')

@section('content')
<div class="container">
    <div class="row">
        <div class="col-md-10 col-md-offset-1">
            <div><b>Transaction</b> View information about a transaction</div>
            <div class="panel panel-default">
                <div class="panel-heading">
                    <a href="{{ route("get:transaction:transaction_hash", ["transaction_hash" => $transactionHash]) }}">{{ $transactionHash }}</a>
                </div>

                <div class="panel-body">
                    <div class="col-md-12">
                        <div class="col-md-3">
                            Admin Wallet id
                        </div>
                        <div class="col-md-1">
                            =>
                        </div>
                        <div class="col-md-8">
                            @foreach ($transactions as $transaction)
                                <div class="row">
                                    <div class="col-md-8">
                                        <a href="{{ route('get:wallet:wallet_id', ['wallet_id' => $transaction->user->wallet_id]) }}" target="_blank">
                                            {{ $transaction->user->wallet_id }}
                                        </a>
                                    </div>
                                    <div class="col-md-4">
                                        {{ $transaction->amount }}
                                    </div>
                                </div>
                            @endforeach
                            <div class="row">
                                <div class="col-md-4 col-md-offset-8">
                                    <h4><span class="label label-primary">{{ number_format($total, 10, '.', '') }}</span></h4>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
