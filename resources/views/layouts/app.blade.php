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
    <script src="{{ asset('/js/app.js', env('REDIRECT_HTTPS')) }}"></script>
    <script src="{{ asset('/js/site.js', env('REDIRECT_HTTPS')) }}"></script>
    <script src="{{ asset('/js/sly.min.js', env('REDIRECT_HTTPS')) }}"></script>
    <script src='//ajax.googleapis.com/ajax/libs/jqueryui/1.8.5/jquery-ui.min.js'></script>
    <script>
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });
    </script>
    @yield('script')
</body>
</html>
