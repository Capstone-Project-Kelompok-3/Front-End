@extends('layouts/authlayout')

@section('title', 'Register')

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
                <span class="question">Already have an account? Login</span>
                <a class="link-ref" href="login.html">here.</a>
            </div>
        </div>
        <div class="right">
            <div class="title">Register</div>
            <div class="input-group">
                <input class="input" type="text" name="name" id="name" placeholder="Name">
                <input class="input" type="email" name="email-reg" id="email-reg" placeholder="Email">
                <input class="input" type="password" name="password" id="password" placeholder="Password">
                <input class="input" type="password" name="re-password" id="re-password" placeholder="Retype Password">
            </div>
            <button class="button-normal btn-green" id="reg-submit">Register</button>
        </div>
    </div>
@endsection

@push('scripts')
    <!-- JavaScript -->
@endpush