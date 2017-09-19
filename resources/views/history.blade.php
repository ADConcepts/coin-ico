@extends('layouts.app')

@section('content')
<div class="container">
    <div class="row">
        <div class="col-md-8 col-md-offset-2">
            <div class="panel panel-default">
                <div class="panel-heading">Transaction history</div>

                <div class="panel-body">
                    <table class="table table-bordered">
                        <tr>
                            <th>Amount</th>
                            <th>Date</th>
                            <th>Description</th>
                        </tr>
                        @if($transactions->count() > 0)
                            @foreach($transactions as $transaction)
                                <tr>
                                    <td>{{ $transaction->amount }}</td>
                                    <td>{{ $transaction->created_at }}</td>
                                    @if($transaction->type == 'deposit')
                                        <td>Deposit {{ $transaction->payment->amount }} {{$currencies[$transaction->payment->currency]}}.</td>
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