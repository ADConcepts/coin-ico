<!DOCTYPE html>
<html lang="{{ config('app.locale') }}">
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
    <link href="{{ asset('/css/site.css', env('REDIRECT_HTTPS')) }}" rel="stylesheet">

    <!-- Scripts -->
</head>
<body>


@yield('content')


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
