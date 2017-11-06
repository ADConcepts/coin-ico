<!DOCTYPE html>
<html lang="{{ config('app.locale') }}">
<head>

    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- CSRF Token -->

    <title>{{ isset($pageTitle) ? $pageTitle.' - ' : '' }}{{ config('app.name', 'CryptedUnited') }}</title>

    <!-- Styles -->
    <link href="{{ asset('/css/site.css') }}" rel="stylesheet">

    <!-- Scripts -->
</head>
<body>


@yield('content')


<script src="{{ asset('/js/site.js') }}"></script>
<script src="{{ asset('/js/sly.min.js') }}"></script>
<script src='http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.5/jquery-ui.min.js'></script>
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
