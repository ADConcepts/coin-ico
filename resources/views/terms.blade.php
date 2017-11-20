@extends('layouts.app')

@section('content')
    <div class="container">
        <div class="row">
            <div class="col-sm-12">
                <div class="select-currency">
                    <h1>CRYPTEDUNITED CROWD-SALE AGREEMENT</h1>
                    <hr>

                    <div class="pb">
                        <pre>{{ $content }}</pre>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection
