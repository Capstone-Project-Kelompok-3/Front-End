@extends('layouts/authlayout')

@section('title', 'Login')

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
                <span class="question">Don't have an account?</span>
                <a class="link-ref" href="{{ route('register') }}">Register now.</a>
            </div>
        </div>

        <form class="right" id="loginForm">
            @csrf
            <div class="title">Login</div>
            <div class="input-group">
                <input class="input" type="text" name="nama-login" id="nama-login" placeholder="Name" required>
                <input class="input" type="password" name="password" id="password" placeholder="Password" required>
                <div class="error-message" id="error-message"></div>
            </div>
            <button type="submit" class="button-normal btn-green" id="log-submit">Login</button>
        </form>
    </div>
@endsection

@push('scripts')
    <script>
        document.getElementById('loginForm').addEventListener('submit', async function (event) {
            event.preventDefault(); // Mencegah submit default

            const nama = document.getElementById('nama-login').value;
            const password = document.getElementById('password').value;
            const errorMessage = document.getElementById('error-message');

            const apiKey = '{{ config('app.api_key') }}';

            // Reset pesan error
            errorMessage.style.display = 'none';
            errorMessage.textContent = '';

            try {
                // Kirim request ke endpoint Node.js dengan fetch API
                const response = await fetch('http://localhost:3000/users/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': apiKey // Ganti dengan API key dari tim backend
                    },
                    body: JSON.stringify({
                        nama,
                        password
                    })
                });

                const data = await response.json(); // Parse response body as JSON

                // Jika login sukses (status code 2xx)
                if (response.ok) { // response.ok checks for 2xx status codes (200-299)
                    if (data.status === 'success') {
                        // Simpan token dan data user ke localStorage
                        localStorage.setItem('token', data.token);
                        localStorage.setItem('user', JSON.stringify(data.user));

                        // Tampilkan pesan sukses (opsional)
                        alert('Login berhasil!');

                        // Redirect ke halaman dashboard atau halaman lain
                        window.location.href = '{{ route("home") }}';
                    } else {
                        // Handle success but API returned an error status (e.g., status: 'fail' within 2xx response)
                        errorMessage.style.display = 'block';
                        errorMessage.textContent = data.message || 'Login gagal.';
                    }
                } else {
                    // Tangani error HTTP (non-2xx status codes)
                    errorMessage.style.display = 'block';
                    if (response.status === 400) {
                        errorMessage.textContent = data.error || data.message || 'Input tidak valid.';
                    }
                    // Error kredensial salah (code 401)
                    else if (response.status === 401) {
                        errorMessage.textContent = data.message || 'Nama atau password salah.';
                    }
                    // Error API key salah (misalnya code 403)
                    else if (response.status === 403) {
                        errorMessage.textContent = 'API key tidak valid.';
                    } else {
                        // General server error
                        errorMessage.textContent = data.message || 'Terjadi kesalahan pada server.';
                    }
                }
            } catch (error) {
                // Tangani network errors atau issues yang tidak terhubung ke server
                errorMessage.style.display = 'block';
                errorMessage.textContent = 'Gagal terhubung ke server. Periksa koneksi Anda.';
                console.error("Network or Fetch Error:", error);
            }
        });
    </script>
@endpush