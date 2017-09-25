@extends('layouts.app')

@section('content')
<div class="container">
    <div class="row">
        <div class="col-md-10 col-md-offset-1">
            <div class="panel panel-default">
                <div class="panel-heading">Transaction detail</div>

                <div class="panel-body">
                    <div class="col-md-12">
                        <div class="row">
                            <label class="control-label col-md-2">Transaction#:</label>
                            <span class="col-md-8">{{ $transaction->transaction_hash }}</span>
                        </div>
                        <div class="row">
                            <label class="control-label col-md-2">Amount:</label>
                            <span class="col-md-8">{{ $transaction->amount }}</span>
                        </div>
                        <div class="row">
                            <label class="control-label col-md-2">Date:</label>
                            <span class="col-md-8">{{ $transaction->created_at }}</span>
                        </div>
                        <div class="row">
                            <label class="control-label col-md-2">Description:</label>
                            <span class="col-md-8">
                                @if($transaction->type == 'deposit')
                                    @php
                                        $currency = strtolower($currencies[$transaction->payment->currency])
                                    @endphp
                                    <td>
                                    @if($currency == 'btc' || $currency == 'ltc')
                                            <a href="https://live.blockcypher.com/{{ $currency }}/tx/{{ $transaction->payment->currency_transaction_id }}" target="_blank">
                                            Deposit {{ $transaction->payment->amount }} {{$currencies[$transaction->payment->currency]}}.
                                        </a>
                                        @else
                                            Deposit {{ $transaction->payment->amount }} {{$currencies[$transaction->payment->currency]}}.
                                        @endif
                                </td>
                                @elseif($transaction->type == 'referral')
                                    <td>{{ $transaction->amount }} referral credit from "{{$transaction->referral->user->email}}".</td>
                                @endif
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
