@extends('layouts.app')

@section('content')
<div class="container">
    <div class="row">
        <div class="col-md-10 col-md-offset-1">
            <div class="panel panel-default">
                <div class="panel-heading">Transaction history</div>

                <div class="panel-body">
                    <table class="table table-bordered">
                        <tr>
                            <th>Transaction#</th>
                            <th>Amount</th>
                            <th>Date</th>
                            <th>Description</th>
                        </tr>
                        @if($transactions->count() > 0)
                            @foreach($transactions as $transaction)
                                <tr>
                                    <td><a href="{{ route('get:transaction:transaction_hash', ['transaction_hash' => $transaction->transaction_hash]) }}">{{ $transaction->transaction_hash }}</a></td>
                                    <td><span class="pull-right">{{ $transaction->amount }}</span></td>
                                    <td>{{ $transaction->created_at }}</td>
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
                                </tr>
                            @endforeach
                        @endif
                    </table>
                    {{ $transactions->links() }}
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
