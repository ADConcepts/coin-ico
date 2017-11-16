@extends('admin.layouts.admin')

@section('content')
<div class="container">
    <div class="row">
        <div class="col-sm-12">
            <div class="select-currency">
                <h1>Welcome @if(auth()->user()) {{ auth()->user()->name }} @endif</h1>

                <hr />

                <div class="pb">

                </div>
            </div>
        </div>
    </div>
</div>
@endsection
