@extends('layouts.app')

@section('content')
<div class="container">
    <div class="row">
        <div class="col-sm-12">
            <div class="select-currency">
                <h1>White paper</h1>
                <hr />

                <div class="pb">
                    <div class="clearfix welcome-text">
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque hendrerit vestibulum pulvinar. Donec quis diam semper, commodo massa eget, placerat risus. Duis nec purus id tellus rutrum pretium. Nam eu ultrices risus. Morbi faucibus lorem eu sapien auctor finibus. Duis ultricies, mi nec condimentum imperdiet, lectus nibh vulputate mauris, rhoncus iaculis nulla erat ut ante. Praesent posuere posuere ex eu vestibulum.</p>
                        <p>Duis accumsan non tortor et tincidunt. Vestibulum quis arcu orci. Aliquam lobortis magna viverra, volutpat lectus ut, scelerisque quam. Interdum et malesuada fames ac ante ipsum primis in faucibus. Ut et hendrerit mauris. In viverra malesuada felis, a mattis dui posuere non. Donec ut lorem vitae nisl mattis tempor. Nulla blandit egestas posuere.</p>
                        <p>Sed vel sem at neque molestie ultricies. Integer ac mattis odio, vel iaculis leo. Aenean mollis in nibh porta pharetra. Maecenas tristique tempus nunc ac eleifend. Fusce hendrerit pretium odio. Morbi porta mauris orci, ornare pretium felis dictum vel. Nullam pretium sollicitudin velit sit amet mattis. Etiam turpis purus, congue in porta eu, bibendum sed dolor. Integer semper magna dui, ut convallis lectus viverra quis. Etiam sed purus quis nibh volutpat auctor ut non dui. Duis elit arcu, bibendum quis augue non, feugiat porttitor ligula. Nulla venenatis, ligula non gravida rutrum, est quam pharetra sem, quis egestas sem nulla vel magna. Curabitur varius arcu felis, ut fringilla tortor dictum elementum. Morbi dui tortor, egestas vitae lacus nec, euismod auctor mauris. Vivamus sit amet felis blandit, vestibulum mi in, tincidunt lacus.</p>
                    </div>
                    <hr />

                    <div class="clearfix welcome-text">
                        <div class="row clearfix">
                            <div class="col-md-10">
                                <h4 class="pull-left">
                                    English | <strong>White Paper v 0.6.1 last change 11-15-2017</strong>
                                </h4>
                            </div>

                            <div class="col-md-2 crypted-btn">
                                <a href="{{ route('get:white-paper:download', ['fileName' => 'white-paper-en.pdf']) }}" class="btn btn-md btn-primary pull-right">Download</a>
                            </div>
                        </div>

                        <div class="row clearfix">
                            <div class="col-md-10">
                                <h4 class="pull-left">
                                    Español | <strong>White Paper v 0.6.1 last change 11-15-2017</strong>
                                </h4>
                            </div>

                            <div class="col-md-2 crypted-btn">
                                <a href="{{ route('get:white-paper:download', ['fileName' => 'white-paper-es.pdf']) }}" class="btn btn-md btn-primary pull-right">Download</a>
                            </div>
                        </div>

                        <div class="row clearfix">
                            <div class="col-md-10">
                                <h4 class="pull-left">
                                    Deutsch | <strong>White Paper v 0.6.1 last change 11-15-2017</strong>
                                </h4>
                            </div>

                            <div class="col-md-2 crypted-btn">
                                <a href="{{ route('get:white-paper:download', ['fileName' => 'white-paper-de.pdf']) }}" class="btn btn-md btn-primary pull-right">Download</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
