@extends('layouts.app')

@section('content')
<div class="container">
    <div class="row">
        <div class="col-sm-12">
            <div class="select-currency">
                <h1>Dashboard</h1>
                <hr>

                <div class="pb">
                    @if(auth()->user() && !auth()->user()->is_admin && auth()->user()->id != 1)
                        <h5><strong>Wallet balance: </strong> {{ $total }}</h5>
                        <div class="pull-right view-history">
                            <a href="{{ route('get:history') }}" class="btn">View history</a>
                        </div>
                    @else
                        <h2 class="text-center admin-welcome">Welcome</h2>
                    @endif
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
