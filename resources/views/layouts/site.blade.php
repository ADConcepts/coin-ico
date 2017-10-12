<!DOCTYPE html>
<html lang="{{ config('app.locale') }}">
<head>

    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- CSRF Token -->

    <title>coin-ico</title>

    <!-- Styles -->
    <link href="{{ asset('/css/site.css') }}" rel="stylesheet">

    <!-- Scripts -->
</head>
<body>


@yield('content')


<script src="{{ asset('/js/site.js') }}"></script>
</body>
</html>
