<!DOCTYPE html>
<html lang="{{ app()->getLocale() }}">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>{{ config('app.name', 'Laravel') }}</title>

    <!-- Styles -->
    <link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css" rel="stylesheet" type="text/css" />
    <link href="{{ asset('css/app.css') }}" rel="stylesheet">
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
                            <li class="{{ (\Request::route()->getName() == 'get:home') ? 'left-active' : '' }}">
                                <a href="{{ route('get:home') }}">Dashboard</a>
                            </li>
                            <li class="{{ (\Request::route()->getName() == 'get:buy') ? 'left-active' : '' }}">
                                <a href="{{ route('get:buy') }}">Buy</a>
                            </li>
                            <li class="{{ (\Request::route()->getName() == 'get:refer') ? 'left-active' : '' }}">
                                <a href="{{ route('get:refer') }}">Refer</a>
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

        @yield('content')
    </div>

    <!-- Scripts -->
    <script src="{{ asset('js/app.js') }}"></script>
    @yield('script')
</body>
</html>
