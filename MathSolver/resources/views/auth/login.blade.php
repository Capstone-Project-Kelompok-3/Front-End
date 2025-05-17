@extends('layouts/authlayout')

@section('title', 'Login')

@push('others-links')
    <!-- head link -->
@endpush

@section('content')
    <!-- Content HTML -->
    <div class="container">
        <div class="left">
            <div class="welcome">
                <span class="welcome-title">Welcome to</span>
                <span class="welcome-logo logo">Math.<span class="green-text">Solver</span></span>
            </div>
            <div class="have-account">
                <span class="question">Don't have an account?</span>
                <a class="link-ref" href="register.html">Register now.</a>
            </div>
        </div>
        <div class="right">
            <div class="title">Login</div>
            <div class="input-group">
                <input class="input" type="email" name="email-login" id="email-login" placeholder="Email">
                <input class="input" type="password" name="password" id="password" placeholder="Password">
            </div>
            <button class="button-normal btn-green" id="log-submit">Login</button>
        </div>
    </div>
@endsection

@push('scripts')
    <!-- JavaScript -->
@endpush