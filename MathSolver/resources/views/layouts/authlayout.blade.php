<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>@yield('title', 'Judul Default') | {{ config('app.name') }}</title>

        <link rel="canonical" href="{{ url()->current() }}">
        <link rel="icon" href="{{ asset('favicon.ico') }}" type="image/x-icon">

        <link rel="stylesheet" href="{{ asset('css/style.css') }}">

        @stack('others-links')
        
    </head>
    <body>
        @yield('content')

        @stack('scripts')
    </body>
</html>