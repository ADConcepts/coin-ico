@extends('admin.layouts.admin')

@section('content')
<div class="container">
    <div class="row">
        <div class="col-sm-12">
            <div class="select-currency">
                <h1>Welcome Admin</h1>

                <hr />

                <div class="pb">


                    <div class="row">
                        <div class="col-lg-4 col-md-4 col-sm-4 col-half">
                            <div class="panel panel-warning">
                                <div class="panel-heading text-center">
                                    <span class="dashboard-title welcome-link">Users</span>
                                </div>
                                <div class="panel-body">
                                    <div class="row">
                                        <div class="col-xs-6 welcome-link">
                                            <i class="fa fa-users fa-5x"></i>
                                        </div>
                                        <div class="col-xs-6 text-right">
                                            <p class="dashboard-figure welcome-link">{{ $totalUsers }}</p>
                                        </div>
                                    </div>
                                </div>
                                <a href="{{ route('get:users:list') }}">
                                    <div class="panel-footer announcement-bottom welcome-link">
                                        <div class="row">
                                            <div class="col-xs-6">
                                                Details
                                            </div>
                                            <div class="col-xs-6 text-right">
                                                <i class="fa fa-arrow-circle-right"></i>
                                            </div>
                                        </div>
                                    </div>
                                </a>
                            </div>
                        </div>
                        <div class="col-lg-4 col-md-4 col-sm-4 col-half">
                            <div class="panel panel-warning">
                                <div class="panel-heading text-center">
                                    <span class="dashboard-title welcome-link">Transactions</span>
                                </div>
                                <div class="panel-body">
                                    <div class="row">
                                        <div class="col-xs-6 welcome-link">
                                            <i class="fa fa-list fa-5x"></i>
                                        </div>
                                        <div class="col-xs-6 text-right">
                                            <p class="dashboard-figure welcome-link">{{ $totalTransactions }}</p>
                                        </div>
                                    </div>
                                </div>
                                <a href="{{ route('get:transactions:list') }}">
                                    <div class="panel-footer announcement-bottom welcome-link">
                                        <div class="row">
                                            <div class="col-xs-6">
                                                Details
                                            </div>
                                            <div class="col-xs-6 text-right">
                                                <i class="fa fa-arrow-circle-right"></i>
                                            </div>
                                        </div>
                                    </div>
                                </a>
                            </div>
                        </div>
                        <div class="col-lg-4 col-md-4 col-sm-4 col-half">
                            <div class="panel panel-warning">
                                <div class="panel-heading text-center">
                                    <span class="dashboard-title welcome-link">Referrals</span>
                                </div>
                                <div class="panel-body">
                                    <div class="row">
                                        <div class="col-xs-6 welcome-link">
                                            <i class="fa fa-user-plus fa-5x"></i>
                                        </div>
                                        <div class="col-xs-6 text-right">
                                            <p class="dashboard-figure welcome-link">{{ $totalReferrals }}</p>
                                        </div>
                                    </div>
                                </div>
                                <a href="{{ route('get:referrals:list') }}">
                                    <div class="panel-footer announcement-bottom welcome-link">
                                        <div class="row">
                                            <div class="col-xs-6">
                                                Details
                                            </div>
                                            <div class="col-xs-6 text-right">
                                                <i class="fa fa-arrow-circle-right"></i>
                                            </div>
                                        </div>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>


                </div>
            </div>
        </div>
    </div>
</div>
@endsection
