@extends('layouts.app')

@section('content')
<div class="container">
    <div class="row">
        <div class="col-md-8 col-md-offset-2">
            <div class="panel panel-default">
                <div class="panel-heading">Dashboard</div>

                <div class="panel-body">
                        Wallet balance: {{ $total }}
                        <div class="pull-right">
                            <a href="{{ route('get:history') }}" class="btn btn-primary">View history</a>
                        </div>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
