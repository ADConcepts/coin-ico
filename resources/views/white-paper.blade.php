@extends('layouts.app')

@section('content')
<div class="container">
    <div class="row">
        <div class="col-sm-12">
            <div class="select-currency">
                <h1>White paper</h1>
                <hr />

                <div class="pb">
                    {{--<div class="clearfix welcome-text">
                    </div>
                    <hr />--}}

                    <div class="clearfix welcome-text">
                        <div class="row clearfix">
                            <div class="col-md-10">
                                <h4 class="pull-left">
                                    English | <strong>White Paper v 0.6.1 last change 11-17-2017</strong>
                                </h4>
                            </div>

                            <div class="col-md-2 crypted-btn">
                                <a href="{{ route('get:white-paper:download', ['fileName' => 'CryptedUnited - White Paper v 061 - English.pdf']) }}" class="btn btn-md btn-primary pull-right">Download</a>
                            </div>
                        </div>

                        <div class="row clearfix">
                            <div class="col-md-10">
                                <h4 class="pull-left">
                                    Español | <strong>White Paper v 0.6.1 last change 11-17-2017</strong>
                                </h4>
                            </div>

                            <div class="col-md-2 crypted-btn">
                                <a href="{{ route('get:white-paper:download', ['fileName' => 'CryptedUnited - White Paper v 061 - Español.pdf']) }}" class="btn btn-md btn-primary pull-right">Descargar</a>
                            </div>
                        </div>

                        <div class="row clearfix">
                            <div class="col-md-10">
                                <h4 class="pull-left">
                                    Deutsch | <strong>White Paper v 0.6.1 last change 11-17-2017</strong>
                                </h4>
                            </div>

                            <div class="col-md-2 crypted-btn">
                                <a href="{{ route('get:white-paper:download', ['fileName' => 'CryptedUnited - White Paper v 061 - Deutsch.pdf']) }}" class="btn btn-md btn-primary pull-right">Download</a>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
