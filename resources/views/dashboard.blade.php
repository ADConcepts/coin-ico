@extends('layouts.app')

@section('content')
<div class="container">
    <div class="row">
        <div class="col-sm-12">
            <div class="select-currency">
                <h1>Welcome</h1>
                <hr />

                <div class="pb">
                    @if(auth()->user() && !auth()->user()->is_admin && auth()->user()->id != 1)
                        <h4 class="clearfix">
                            <span class="pull-left"><strong>Welcome</strong> {{ auth()->user()->name }},</span>
                            <span class="pull-right">
                                <strong>Wallet balance: </strong> {{ $total }}
                            </span>
                        </h4>
                        <div class="clearfix">
                            <br>
                            <div class="pull-right view-history">
                                <a href="{{ route('get:history') }}" class="btn">View history</a>
                            </div>
                        </div>
                    @endif

                    <div class="clearfix"></div>
                    <div class="welcome-text">
                        <p>The pre-ICO will start in <span class="getting-started">00 : 00 : 00</span>.</p>
                        <p>Please read our <a href="{{ route('get:white-paper') }}" target="_blank" class="welcome-link"><strong>WhitePaper</strong></a> and join us on
                            <a href="https://join.slack.com/t/cryptedunited/shared_invite/enQtMjU0MjU4NTY3MDI5LWJiZWI3MmNjYTQ4OTFhYjc5ZWM2YTczZDRhNzhjZGJkMjU1YThkMzgyNGEzZGI5MzljMDdmYTVjZmFkMzEzYWM" target="_blank" class="welcome-link"><strong>slack</strong></a>, <a href="https://www.reddit.com/r/CryptedUnited/" target="_blank" class="welcome-link"><strong>reddit</strong></a>, and <a href="https://www.facebook.com/CryptedUnited-335452040260167/" target="_blank" class="welcome-link"><strong>facebook</strong></a> if you have questions.</p>
                        <p>You already have the chance to refer potential investors and earn 5% commission on every purchase they make during pre-ICO and ICO.</p>
                        <p>You can see your referral count and find your ref-link under <a href="{{ route('get:refer') }}" class="welcome-link"><strong>Refer</strong></a>.</p>
                        <p>As soon as the pre-ICO is starting, you can buy shares of CryptedUnited under <a href="{{ route('get:buy') }}" class="welcome-link"><strong>Buy</strong></a>.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection


@section('script')
<script>
    $('.getting-started').countdown('2017/12/01', function(event) {
        $(this).html(event.strftime('%d : %H : %M'));
    });
</script>
@endsection
