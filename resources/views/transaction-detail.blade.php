@extends('layouts.app')

@section('content')
<div class="container">
    <div class="row">
        <div class="col-sm-12">
            <div>
                <h1>
                    <b>Transaction</b>
                    <small>View information about a transaction</small>
                </h1>
            </div>
            <div class="select-currency">
                <h5>
                    <a href="{{ route("get:transaction:transaction_hash", ["transaction_hash" => $transactionHash]) }}">{{ $transactionHash }}</a>
                </h5>

                <hr class="seperator">

                <div class="pb table-responsive">
                    <table class="table data-history">
                        <tbody>
                            <tr class="tabel-heading">
                                <td>
                                    <a href="{{ route('get:wallet:wallet_id', ['wallet_id' => $adminUser->wallet_id]) }}" target="_blank" title="{{ $adminUser->wallet_id }}">
                                        {{ $adminUser->wallet_id }}
                                    </a>
                                    ({{ $transactionCurrency }})
                                </td>
                                <td>
                                   <i class="fa fa-arrow-right fa-2x text-color" ></i>
                                </td>
                                <td>
                                    @foreach ($transactions as $transaction)
                                        <div class="row">
                                            <div class="col-sm-3">
                                                {{ $transaction->created_at }}
                                            </div>
                                            <div class="col-sm-6">
                                                <a href="{{ route('get:wallet:wallet_id', ['wallet_id' => $transaction->user->wallet_id]) }}" target="_blank" title="{{ $transaction->user->wallet_id }}">
                                                    {{ $transaction->user->wallet_id }}
                                                </a>
                                            </div>
                                            <div class="col-sm-3">
                                                {{ $transaction->amount }}
                                            </div>
                                        </div>
                                        <?php
                                            if(!$bonusTransaction) {
                                                $bonusTransaction = ($transaction->type == 'bonus') ? true : false;
                                            }
                                        ?>
                                    @endforeach
                                    <div class="row row-no-margin">
                                        <div class="col-sm-4 col-md-offset-9">
                                            <h4><span class="label label-color">{{ number_format($total, 10, '.', '') }}</span></h4>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <h3>Proof of value transfer</h3>
                    <hr />
                    <div class="container">
                        <div class="row">
                            <div class="col-md-3">
                                <strong>Currency Used: </strong>
                            </div>
                            <div class="col-md-3">
                                {{ $transactionCurrency }}
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-3">
                                <strong>Exchangerate at Time of Purchase: </strong>
                            </div>
                            <div class="col-md-3">
                                {{ $transactionExchangeRate }}
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-3">
                                <strong>Amount Sent: </strong>
                            </div>
                            <div class="col-md-3">
                                {{ $paymentTransaction->payment->amount }}
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-3">
                                <strong>Reference TX: </strong>
                            </div>
                            <div class="col-md-3">
                                <a href="https://blockchain.info/tx/{{ $transactionHash }}" target="_blank">{{ $transactionHash }}</a>
                            </div>
                        </div>
                        @if ($bonusTransaction)
                            <div class="row">
                                <div class="col-md-3">
                                    <strong>Effective Bonus: </strong>
                                </div>
                                <div class="col-md-3">
                                    50% (pre-ICO 1st Round)
                                </div>
                            </div>
                        @endif
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
