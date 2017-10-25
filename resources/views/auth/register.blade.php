@extends('layouts.site')

@section('content')

    <div class="login-main">

        <div class="login-left">
            <div class="left-vpad">
                <h1>Crypted United</h1>

                <p>Shape the future, <br>
                    Own the company, <br>
                    Be the change</p>
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
                            {{--<div class="stepwizard-step col-xs-3">
                                <a href="#step-2" type="button" class="btn btn-default btn-circle" disabled="disabled">2</a>
                                <p><small>Step2</small></p>
                            </div>
                            <div class="stepwizard-step col-xs-3">
                                <a href="#step-3" type="button" class="btn btn-default btn-circle" disabled="disabled">3</a>
                                <p><small>Schedule</small></p>
                            </div>--}}
                            <div class="stepwizard-step col-sm-6">
                                <a href="#step-4" type="button" class="btn btn-default btn-circle" disabled="disabled">2</a>
                                <p><small>Step2</small></p>
                            </div>
                        </div>
                    </div>

                    <form role="form">
                        <div class="setup-content" id="step-1">
                            {{--<div class="panel-heading">
                                <h3 class="panel-title">Shipper</h3>
                            </div>--}}
                            <div class="panel-body">

                                <div class="form-group fg">
                                    <label class="control-label">Username:</label>
                                    <input type="text" required="required" class="form-control fc" placeholder="Enter Username" />
                                </div>

                                <div class="form-group fg">
                                    <label class="control-label">Email-address:</label>
                                    <input type="text" required="required" class="form-control fc" placeholder="Enter Email" />
                                </div>

                                <div class="form-group fg">
                                    <label class="control-label">Password:</label>
                                    <input type="password" required="required" class="form-control fc" placeholder="Enter Passowrd" />
                                </div>

                                <div class="forgot">
                                    <button class="btn btn-default nextBtn pull-right" type="button">Next</button>
                                </div>

                            </div>
                        </div>

                        {{--<div class="setup-content" id="step-2">
                            <div class="panel-heading">
                                <h3 class="panel-title">Destination</h3>
                            </div>
                            <div class="panel-body">
                                <div class="form-group">
                                    <label class="control-label">Company Name</label>
                                    <input maxlength="200" type="text" required="required" class="form-control" placeholder="Enter Company Name" />
                                </div>
                                <div class="form-group">
                                    <label class="control-label">Company Address</label>
                                    <input maxlength="200" type="text" required="required" class="form-control" placeholder="Enter Company Address" />
                                </div>
                                <button class="btn btn-primary nextBtn pull-right" type="button">Next</button>
                            </div>
                        </div>

                        <div class="setup-content" id="step-3">
                            <div class="panel-heading">
                                <h3 class="panel-title">Schedule</h3>
                            </div>
                            <div class="panel-body">
                                <div class="form-group">
                                    <label class="control-label">Company Name</label>
                                    <input maxlength="200" type="text" required="required" class="form-control" placeholder="Enter Company Name" />
                                </div>
                                <div class="form-group">
                                    <label class="control-label">Company Address</label>
                                    <input maxlength="200" type="text" required="required" class="form-control" placeholder="Enter Company Address" />
                                </div>
                                <button class="btn btn-primary nextBtn pull-right" type="button">Next</button>
                            </div>
                        </div>--}}

                        <div class="setup-content" id="step-4">
                            {{--<div class="panel-heading">
                                <h3 class="panel-title">Cargo</h3>
                            </div>--}}
                            <div class="panel-body">
                                <div class="form-group fg">
                                    <label class="control-label">Country of Residence:</label>
                                    {{--<input maxlength="200" type="text" required="required" class="form-control" placeholder="Enter Company Name" />--}}

                                    <select class="fc">
                                        <option>India</option>
                                        <option>USA</option>
                                        <option>UK</option>
                                        <option>CANADA</option>

                                    </select>
                                </div>
                                <div class="form-group fg">
                                    <label class="control-label">Country of Birth (Nationality):</label>
                                    {{--<input maxlength="200" type="text" required="required" class="form-control" placeholder="Enter Company Address" />--}}

                                    <select class="fc">
                                        <option>India</option>
                                        <option>USA</option>
                                        <option>UK</option>
                                        <option>CANADA</option>
                                    </select>
                                </div>

                                <div class="fg">

                                    <input class="styled-checkbox" id="styled-checkbox-1" type="checkbox" value="value1">
                                    <label for="styled-checkbox-1">accept Terms of Service</label>

                                </div>

                                   <div class="forgot">

                                       <button class="btn btn-default pull-right" type="submit">Finish!</button>

                                   </div>

                                   </div>
                        </div>
                    </form>




            </div>
        </div>

    </div>

@endsection
