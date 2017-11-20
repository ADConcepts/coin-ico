@extends('layouts.app')

@section('content')
    <style>
        pre {
            white-space: pre-line;       /* Since CSS 2.1 */
            white-space: -moz-pre-wrap;  /* Mozilla, since 1999 */
            white-space: -pre-wrap;      /* Opera 4-6 */
            white-space: -o-pre-wrap;    /* Opera 7 */
            word-break: normal;
        }
    </style>
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
