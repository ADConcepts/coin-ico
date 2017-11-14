@extends('layouts.site')

@section('content')

    <div class="login-main">

        <div class="login-left">
            <div class="left-vpad">
                <a href="{{ route('home') }}"><h1>Crypted United</h1></a>

                <p>Shape the Future<br>
                    Own the Company<br>
                    Be the Change</p>
            </div>
        </div>

        <div class="login-right">
            <div class="form-login">
                <h1>Register</h1>

                <div class="stepwizard">
                    <div class="stepwizard-row setup-panel">
                        <div class="stepwizard-step col-sm-6">
                            <a href="#step-1" type="button" class="btn btn-success btn-circle">1</a>
                            <p><small>Step1</small></p>
                        </div>
                        <div class="stepwizard-step col-sm-6">
                            <a href="#step-2" type="button" class="btn btn-default btn-circle disabled" disabled="disabled">2</a>
                            <p><small>Step2</small></p>
                        </div>
                    </div>
                </div>
                @if ($errors->any())
                    <div class="alert alert-danger">
                        <ul>
                            @foreach ($errors->all() as $error)
                                <li>{{ $error }}</li>
                            @endforeach
                        </ul>
                    </div>
                @endif
                <form class="form-horizontal" method="POST" action="{{ route('register') }}" role="form">
                    {{ csrf_field() }}
                    <div class="setup-content" id="step-1">
                        <div class="panel-body">
                            <div class="form-group fg{{ $errors->has('name') ? ' has-error' : '' }}">
                                <label class="control-label">Name:</label>
                                <input type="text" class="form-control fc" placeholder="Enter Name" name="name" value="{{ old('name') }}"/>
                                @if ($errors->has('name'))
                                    <span class="help-block">
                                        <strong>{{ $errors->first('name') }}</strong>
                                    </span>
                                @endif
                            </div>

                            <div class="form-group fg{{ $errors->has('email') ? ' has-error' : '' }}">
                                <label class="control-label">Email-address:</label>
                                <input type="email" class="form-control fc" placeholder="Enter Email" name="email" value="{{ old('email') }}" />
                                @if ($errors->has('email'))
                                    <span class="help-block">
                                        <strong>{{ $errors->first('email') }}</strong>
                                    </span>
                                @endif
                            </div>

                            <div class="form-group fg{{ $errors->has('password') ? ' has-error' : '' }}">
                                <label class="control-label">Password:</label>
                                <input type="password" class="form-control fc" placeholder="Enter Password" name="password" />
                                @if ($errors->has('password'))
                                    <span class="help-block">
                                        <strong>{{ $errors->first('password') }}</strong>
                                    </span>
                                @endif
                            </div>

                            <div class="form-group fg">
                                <label for="password-confirm" class="control-label">Confirm Password</label>
                                <input id="password-confirm" type="password" class="form-control fc" placeholder="Confirm Password" name="password_confirmation" />
                            </div>


                        </div>

                        <div class="forgot">
                            <button class="btn btn-default nextBtn pull-right" type="button">Next</button>
                        </div>
                    </div>

                    <div class="setup-content" id="step-2">
                        <div class="panel-body">
                            <div class="form-group fg{{ $errors->has('residence_country_id') ? ' has-error' : '' }}">
                                <label class="control-label">Country of Residence:</label>
                                <select class="fc" name="residence_country_id" id="residence_country_id">
                                    <optgroup>
                                        <option value="" disabled selected>Select Country of Residence*</option>
                                        <option value="0">Non US Citizen</option>
                                        @foreach($countries as  $country)
                                            <option value="{{$country->id}}">{{$country->name}}</option>
                                        @endforeach
                                    </optgroup>
                                </select>
                                @if ($errors->has('residence_country_id'))
                                    <span class="help-block">
                                        <strong>{{ $errors->first('residence_country_id') }}</strong>
                                    </span>
                                @endif
                            </div>
                            <div class="form-group fg{{ $errors->has('birth_country_id') ? ' has-error' : '' }}">
                                <label class="control-label">Country of Birth (Nationality):</label>
                                <select class="fc" name="birth_country_id" id="birth_country_id">
                                    <option value="" disabled selected>Select Nationality*</option>
                                    <option value="0">Non US Citizen</option>
                                    @foreach($countries as  $country)
                                        <option value="{{$country->id}}">{{$country->name}}</option>
                                    @endforeach
                                </select>
                                @if ($errors->has('birth_country_id'))
                                    <span class="help-block">
                                        <strong>{{ $errors->first('birth_country_id') }}</strong>
                                    </span>
                                @endif
                            </div>
                            <div class="form-group fg">
                                <span class="text-info">Country of Residence and Birth are mandatory only for US citizens. If you are neither, you can select 'Non US Citizen'.</span>
                            </div>
                            <div class="fg">
                                <input class="styled-checkbox" id="terms" type="checkbox" value="value1">
                                <label for="terms"></label>
                                <label>
                                    <a href="{{ route('get:terms') }}" target="_blank" class="text-info">
                                        Crowdsale Agreement
                                    </a>
                                </label>
                            </div>

                            @if(!\Session::has('code'))
                                <div class="form-group fg">
                                    <label class="control-label">Enter Reference Code:</label>
                                    <input id="refcode" type="text" class="form-control fc" placeholder="Enter Reference Code" />
                                    <span class="help-block">
                                    </span>
                                </div>
                            @endif

                        </div>

                        <div class="forgot">
                            <button class="btn btn-default pull-right" type="submit" id="submit" disabled>Finish!</button>
                        </div>
                    </div>
                </form>
                <div class="line-form">
                    <hr>
                </div>
                <div class="create-account clearfix">
                    <a href="javascript:void(0)">Already have an account?</a>
                    <a href="{{ route('login') }}" class="btn btn-default reg">Login</a>
                </div>
            </div>
        </div>
    </div>
@endsection

@section('script')
    <script>
        $(document).on('keyup', '#refcode', function(e) {
            if (e.keyCode == 13) {
                setRefer(true);
            }
        });

        function setRefer(force) {
            var refCode = $("#refcode");
            var existingString = refCode.val();
            if (!force){
                return false;
            }
            $.get('/refer/'+ existingString, function(data) {
                if (!data.success) {
                    refCode.closest('.form-group').removeClass('has-success').addClass('has-error').find('.help-block').text(data.message);
                    return false;
                } else {
                    refCode.closest('.form-group').removeClass('has-error').addClass('has-success').find('.help-block').text(data.message);
                }
            });
        }

    </script>

    @if($errors->any() && !$errors->has('name') && !$errors->has('email') && !$errors->has('password'))
        <script>
            $(document).ready(function() {
                setTimeout(function() {
                    $('div.setup-panel div a[href="#step-2"]').removeAttr('disabled').removeClass('disabled').trigger('click');
                },10);
            });
        </script>
    @endif
@endsection
