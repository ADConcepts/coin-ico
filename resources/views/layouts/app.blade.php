<!DOCTYPE html>
<html lang="{{ app()->getLocale() }}">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- Meta tags -->
    <meta name="author" content="Crypted United">
    <meta name="description" content="Participate in our ICO to own a Share of our Cryptocurrency Platform and receive Dividends.">
    <meta property="og:url" content="{{ url('/') }}" />
    <meta property="og:type" content="article" />
    <meta property="og:title" content="Crypted United | 1 Coin - 1 Share - 1 Vote" />
    <meta property="og:description" content="Participate in our ICO to own a Share of our Cryptocurrency Platform and receive Dividends." />
    <meta property="og:image" content="{{ asset('/images/og-image.png', env('REDIRECT_HTTPS')) }}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />

    <!-- Icons -->
    <link rel="apple-touch-icon" sizes="180x180" href="/images/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="/images/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/images/favicon-16x16.png">
    <link rel="manifest" href="/images/manifest.json">
    <link rel="mask-icon" href="/images/safari-pinned-tab.svg" color="#5bbad5">
    <meta name="theme-color" content="#ffffff">

    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>{{ isset($pageTitle) ? $pageTitle.' - ' : '' }}{{ config('app.name', 'CryptedUnited') }}</title>

    <!-- Styles -->
    <link href="//maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css" rel="stylesheet" type="text/css" />
    <link href="{{ asset('css/app.css', env('REDIRECT_HTTPS')) }}" rel="stylesheet">
</head>
<body>
    <div id="app">
        <nav class="navbar navbar-default navbar-static-top nav-df">
            <div class="container">
                <div class="navbar-header">

                    <!-- Collapsed Hamburger -->
                    <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#app-navbar-collapse">
                        <span class="sr-only">Toggle Navigation</span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                    </button>

                    <!-- Branding Image -->
                    <a class="navbar-brand" href="{{ url('/') }}">
                       {{-- {{ config('app.name', 'Laravel') }}--}}
                        <img src="/images/admin-panel-logo.png" class="img-responsive" />
                    </a>
                </div>

                <div class="collapse navbar-collapse" id="app-navbar-collapse">
                    <!-- Left Side Of Navbar -->
                    <ul class="nav navbar-nav left-menu">
                        @auth
                            <li class="{{ (\Request::route()->getName() == 'get:dashboard') ? 'left-active' : '' }}">
                                <a href="{{ route('get:dashboard') }}">Dashboard</a>
                            </li>
                            <li class="{{ (\Request::route()->getName() == 'get:buy') ? 'left-active' : '' }}">
                                <a href="{{ route('get:buy') }}">Buy</a>
                            </li>
                            <li class="{{ (\Request::route()->getName() == 'get:refer') ? 'left-active' : '' }}">
                                <a href="{{ route('get:refer') }}">Refer</a>
                            </li>
                            <li class="{{ (\Request::route()->getName() == 'get:polls') ? 'left-active' : '' }}">
                                <a href="{{ route('get:polls') }}">Polls</a>
                            </li>
                            <li class="{{ (\Request::route()->getName() == 'get:white-paper') ? 'left-active' : '' }}">
                                <a href="{{ route('get:white-paper') }}">Whitepaper</a>
                            </li>
                        @endauth
                    </ul>

                    <!-- Right Side Of Navbar -->
                    <ul class="nav navbar-nav navbar-right nav-main">
                        <!-- Authentication Links -->
                        @guest
                            <li class="{{ (\Request::route()->getName() == 'login') ? 'orange-bar' : '' }}">
                                <a href="{{ route('login') }}">Login</a>
                            </li>
                            <li class="{{ (\Request::route()->getName() == 'register') ? 'orange-bar' : '' }}">
                                <a href="{{ route('register') }}">Register</a>
                            </li>
                        @else
                            <li class="dropdown dp">
                                <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">
                                    <span class="username">{{ Auth::user()->name }}</span> <i class="glyphicon glyphicon-user"></i><span class="caret"></span>
                                </a>

                                <ul class="dropdown-menu dd-menu" role="menu">
                                    @if (Auth::user()->is_admin)
                                        <li><a href="{{ route('get:dashboard:admin') }}">Admin Dashboard </a></li>
                                    @endif
                                    <li><a href="{{ route('get:wallet:wallet_id', ['wallet_id' => Auth::user()->wallet_id]) }}">My wallet </a></li>
                                    <li>
                                        <a href="{{ route('logout') }}"
                                            onclick="event.preventDefault();
                                                     document.getElementById('logout-form').submit();">
                                            Logout
                                        </a>

                                        <form id="logout-form" action="{{ route('logout') }}" method="POST" style="display: none;">
                                            {{ csrf_field() }}
                                        </form>
                                    </li>
                                </ul>
                            </li>
                        @endguest
                    </ul>
                </div>
            </div>
        </nav>

        @if (session('alert'))
           <div class="container">
               <div class="alert alert-success">
                   {{ session('alert') }}
               </div>
           </div>
        @endif

        @if (session('success'))
            <div class="container">
                <div class="alert alert-success">
                    {{ session('success') }}
                </div>
            </div>
        @endif

        @if (session('error'))
            <div class="container">
                <div class="alert alert-danger">
                    {{ session('error') }}
                </div>
            </div>
        @endif

        @yield('content')
    </div>

    <!-- Scripts -->
    <script src="{{ asset('/js/site.js', env('REDIRECT_HTTPS')) }}"></script>
    <script src="{{ asset('/js/app.js', env('REDIRECT_HTTPS')) }}"></script>
    <script src="{{ asset('/js/sly.min.js', env('REDIRECT_HTTPS')) }}"></script>
    <script src='//ajax.googleapis.com/ajax/libs/jqueryui/1.8.5/jquery-ui.min.js'></script>
    <script>
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });
    </script>
    <script>
        window.counterEndDate = '{{ env('COUNTER_END_DATE') }}';
        window.currentTime = '{{ date('Y/m/d h:i:s') }}';
    </script>
    <!-- Global site tag (gtag.js) - Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=UA-110023731-1"></script>
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());

        gtag('config', 'UA-110023731-1');
    </script>
    <!-- Facebook Pixel Code -->
    <script>
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '2005337153075859');
        fbq('track', 'PageView');
    </script>
    <noscript><img height="1" width="1" style="display:none"
                   src="https://www.facebook.com/tr?id=2005337153075859&ev=PageView&noscript=1"
        /></noscript>
    <!-- End Facebook Pixel Code -->
    @yield('script')
</body>
</html>
