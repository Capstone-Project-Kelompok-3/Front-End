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
                <span class="welcome-logo logo">Math.<span class="green-text">In</span></span>
            </div>
            <div class="have-account">
                <span class="question">Already have an account? Login</span>
                <a class="link-ref" href="{{ route('login') }}">here.</a>
            </div>
        </div>
        <form class="right"action="{{ route('register-submit') }}" method="POST">
            @csrf
            <div class="title">Register</div>
            <div class="input-group">
                <input class="input" type="text" name="name" id="name" placeholder="Name" required>
                <input class="input" type="email" name="email-reg" id="email-reg" placeholder="Email" required>
                <input class="input" type="password" name="password" id="password" placeholder="Password" required>
                <input class="input" type="password" name="re-password" id="re-password" placeholder="Retype Password" required>
            </div>
            <button class="button-normal btn-green" id="reg-submit">Register</button>
        </form>
    </div>
@endsection

@push('scripts')
    <!-- JavaScript -->
@endpush