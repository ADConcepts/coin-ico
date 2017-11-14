@extends('layouts.app')

@section('content')
    <div class="container">
        <div class="row">
            <div class="col-sm-12">
                <div class="select-currency">
                    <h1>Upcoming Polls</h1>

                    <hr />

                    <div class="pb">
                        <div class="welcome-text">
                            <p>As you may already know, the voting mechanism is an important part of CryptedUnited.</p>
                            <p>We want to get you involved into this process as soon as possible and this page will list the upcoming polls you will be able to participate in.</p>
                            <p>Polls marked as [POP] are Popular Opinion Polls and have no direct influx on any decisions made from its results</p>
                        </div>
                        <hr />

                        <div class="clearfix welcome-text">
                            <div class="row clearfix">
                                <div class="col-md-10">
                                    <h4 class="pull-left">
                                        <strong>We are looking for a name and have decided that a CrowdOwned Coin deserves a CrowdSourced name.</strong>
                                    </h4>
                                </div>

                                <div class="col-md-2 view-history">
                                    <a href="" class="btn btn-sm pull-right">Vote Now!</a>
                                </div>
                            </div>
                            <br />

                            <div class="row clearfix">
                                <div class="col-md-10">
                                    <h4 class="pull-left">
                                        <strong>As announced are you to vote how dividends will be distributed to the shareholders.</strong>
                                    </h4>
                                </div>

                                <div class="col-md-2 view-history">
                                    <a href="" class="btn btn-sm pull-right">Vote Now!</a>
                                </div>
                            </div>
                            <br />

                            <div class="row clearfix">
                                <div class="col-md-10">
                                    <h4 class="pull-left">
                                        <strong>[POP] Which is your favorite Coin right now?</strong>
                                        <br />
                                        <small>Polls will be developed during pre-ICO and start after the pre-ICO is finished. Only shareholders will be able to vote.</small>
                                    </h4>
                                </div>

                                <div class="col-md-2 view-history">
                                    <a href="" class="btn btn-sm pull-right">Vote Now!</a>
                                </div>
                            </div>

                        </div>

                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection
