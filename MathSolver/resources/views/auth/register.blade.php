@extends('layouts/authlayout')

@section('title', 'Register')

@push('others-links')
    <!-- head link -->
    <!-- Optional: Tambahkan CSS untuk styling error -->
    <style>
        .error-message {
            color: red;
            font-size: 0.9em;
            margin-top: 5px;
            display: none;
        }
    </style>
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
        <form class="right" id="registerForm">
            @csrf
            <div class="title">Register</div>
            <div class="input-group">
                <input class="input" type="text" name="name" id="name" placeholder="Name" required>
                <input class="input" type="email" name="email-reg" id="email-reg" placeholder="Email" required>
                <input class="input" type="password" name="password" id="password" placeholder="Password" required>
                <input class="input" type="password" name="re-password" id="re-password" placeholder="Retype Password" required>
                <div class="error-message" id="error-message"></div>
            </div>
            <button type="submit" class="button-normal btn-green" id="reg-submit">Register</button>
        </form>
    </div>
@endsection

@push('scripts')
    <script>
        document.getElementById('registerForm').addEventListener('submit', async function (event) {
            event.preventDefault(); // Prevent default form submission

            const nama = document.getElementById('name').value;
            const email = document.getElementById('email-reg').value;
            const password = document.getElementById('password').value;
            const rePassword = document.getElementById('re-password').value;
            const errorMessage = document.getElementById('error-message');

            const apiKey = '{{ config('app.api_key') }}';

            // Reset error message
            errorMessage.style.display = 'none';
            errorMessage.textContent = '';

            // Basic client-side validation for password match
            if (password !== rePassword) {
                errorMessage.style.display = 'block';
                errorMessage.textContent = 'Passwords do not match.';
                return; // Stop the submission
            }

            try {
                // Send request using Fetch API
                const response = await fetch('http://localhost:3000/users', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': apiKey // Replace with your API key
                    },
                    body: JSON.stringify({
                        nama,
                        email,
                        password
                    })
                });

                const data = await response.json();

                // If registration is successful (status code 2xx)
                if (response.ok) { // response.ok checks for 2xx status codes
                    if (data.status === 'success') {
                        // Redirect to the login page
                        window.location.href = '{{ route("login") }}';
                    } else {
                        // Handle success but API returned an error status
                        errorMessage.style.display = 'block';
                        errorMessage.textContent = data.message || 'Registration failed.';
                    }
                } else {
                    // Handle HTTP errors (non-2xx status codes)
                    errorMessage.style.display = 'block';
                    if (response.status === 400) {
                        errorMessage.textContent = data.error || data.message || 'Invalid input.';
                    } else if (response.status === 401) {
                        errorMessage.textContent = data.error || 'Authentication failed.';
                    } else if (response.status === 403) {
                        errorMessage.textContent = 'Invalid API key.';
                    } else {
                        errorMessage.textContent = 'An error occurred on the server.';
                    }
                }
            } catch (error) {
                // Handle network errors or issues reaching the server
                errorMessage.style.display = 'block';
                errorMessage.textContent = 'Failed to connect to the server.';
            }
        });
    </script>
@endpush