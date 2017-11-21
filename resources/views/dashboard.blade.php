@extends('layouts.app')

@section('content')
<div class="container">
    <div class="row">
        <div class="col-sm-12">
            <div class="select-currency">
                <h1>Welcome @if(auth()->user()) {{ auth()->user()->name }} @endif</h1>

                <hr />

                <div class="pb">
                    <div class="welcome-text">
                        <p>The pre-ICO will start in <span class="getting-started welcome-link">00 : 00 : 00 : 00</span></p>
                        <p>Please read our <a href="{{ route('get:white-paper') }}" target="_blank" class="welcome-link"><strong>WhitePaper</strong></a> and join us on
                            <a href="https://join.slack.com/t/cryptedunited/shared_invite/enQtMjU0MjU4NTY3MDI5LWJiZWI3MmNjYTQ4OTFhYjc5ZWM2YTczZDRhNzhjZGJkMjU1YThkMzgyNGEzZGI5MzljMDdmYTVjZmFkMzEzYWM" target="_blank" class="welcome-link"><strong>slack</strong></a>, <a href="https://www.reddit.com/r/CryptedUnited/" target="_blank" class="welcome-link"><strong>reddit</strong></a>, and <a href="https://www.facebook.com/CryptedUnited-335452040260167/" target="_blank" class="welcome-link"><strong>facebook</strong></a> if you have questions.</p>
                        <p>You already have the chance to refer potential investors and earn 5% commission on every purchase they make during pre-ICO and ICO.</p>
                        <p>You can see your referral count and find your ref-link under <a href="{{ route('get:refer') }}" class="welcome-link"><strong>Refer</strong></a>.</p>
                        <p>As soon as the pre-ICO is starting, you can buy shares of CryptedUnited under <a href="{{ route('get:buy') }}" class="welcome-link"><strong>Buy</strong></a>.</p>
                    </div>
                    <hr />
                    @if(auth()->user() && !auth()->user()->is_admin && auth()->user()->id != 1)
                        <div class="clearfix text-center">
                            <h4 class="pull-left">
                                <strong>Wallet balance: </strong> {{ $total }}
                            </h4>
                            <div class="pull-right view-history">
                                <a href="{{ route('get:history') }}" class="btn">View history</a>
                            </div>
                        </div>
                    @endif
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
