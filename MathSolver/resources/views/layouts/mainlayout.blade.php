<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>@yield('title', 'Judul Default') | {{ config('app.name') }}</title>
        
        <meta name="description" content="@yield('description', 'Deskripsi default situs Anda.')">
        <meta name="keywords" content="@yield('keywords', 'default, kata kunci')">
        <meta name="author" content="@yield('author', 'Nama Anda atau Brand')">
        <meta name="robots" content="@yield('robots', 'index, follow')">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <link rel="canonical" href="{{ url()->current() }}">
        <link rel="icon" href="{{ asset('favicon.ico') }}" type="image/x-icon">

        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css" integrity="sha512-Evv84Mr4kqVGRNSgIGL/F/aIDqQb7xQ2vcrdIwxfjThSH8CSR7PBEakCr51Ck+w+/U6swU2Im1vVX0SVk9ABhg==" crossorigin="anonymous" referrerpolicy="no-referrer" />
        <link rel="stylesheet" href="{{ asset('css/style.css') }}">

        @stack('others-links')
        
    </head>
    <body>
        @include('components.header')
        
        @yield('content')
        
        @include('components.footer')

        @stack('scripts')
    </body>
</html>
