@extends('layouts.app')
@section('content')
    <div class="container">
        <div class="row">
            <div class="col-md-8 col-md-offset-2">
                <div class="panel panel-default">
                    <div class="panel-heading">Refer a friend</div>
                    <div class="panel-body">
                        @if (session('success'))
                            <div class="alert alert-success">
                                {{ session('success') }}
                            </div>
                        @endif
                        @if (session('error'))
                            <div class="alert alert-danger">
                                {{ session('error') }}
                            </div>
                        @endif
                        <form class="form-horizontal" method="POST" action="{{ route('post:refer') }}">
                            {{ csrf_field() }}

                            <div class="form-group{{ $errors->has('emails') ? ' has-error' : '' }}">
                                <label for="emails" class="col-md-4 control-label">E Mails.</label>

                                <div class="col-md-6">
                                    <textarea type="text" class="form-control" name="emails" required autofocus>{{ old('emails') }}</textarea>
                                    <span class="help-block">Please use (,) to seperate multiple emails.</span>
                                    @if ($errors->has('emails'))
                                        <span class="help-block">
                                        <strong>{{ $errors->first('emails') }}</strong>
                                    </span>
                                    @endif
                                </div>
                            </div>

                            <div class="form-group">
                                <div class="col-md-8 col-md-offset-4">
                                    <button type="submit" class="btn btn-primary">
                                        Submit
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection
