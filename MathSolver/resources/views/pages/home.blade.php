@extends('layouts/mainlayout')

@section('title', 'Home')
@section('description', 'Selamat datang di situs kami, website untuk menyelesaikan soal matematika')
@section('keywords', 'langkah-langkah, matematika, website')
@section('author', 'MathSolver Dev')

@section('content')

<section class="home">
    <div class="main">
        <div class="hero">
            <div class="title-area">
                <div class="title">
                    <span class="title-1 white-text">
                        Start Solving 
                        <span class="main-logo">Math.<span>In</span></span>
                        <span class="green-text"> Easy Way</span>
                    </span>
                    <span class="title-2">Struggling with math problems? Find the solution here!</span>
                </div>
                <!-- Bila Belum Login -->
                <div id="registerButtonContainer" style="display: none;">
                    <button onclick="location.href='{{ route('register') }}'" class="button-normal btn-green">Register</button>
                </div>
                <!-- Bila Sudah Login -->
                <div id="goButtonContainer" style="display: none;">
                    <button onclick="scrollToCenter()" class="button-normal btn-green">Go!</button>
                </div>
            </div>
            <div class="illustration">
                <img src="{{ asset('images/illustration.webp') }}" alt="MathSolver Ilustration">
            </div>
        </div>

        <div class="input-group" id="input-group">
            <form class="upload-area" id="upload-area" enctype="multipart/form-data" method="POST" action="{{ url('/solve-from-image') }}">
                @csrf
                <input type="file" name="image" id="up-soal" style="display: none;">
                <button id="up-button" class="button-normal-rd btn-blue" type="button">Upload Image</button>
                <span class="text-drag">or drop a photo here</span>
                <img id="preview-image" style="display: none; max-height: 200px; margin-top: 16px; border-radius: 12px;" />
                <button class="button-round btn-red" id="remove-image" style="display: none; position: absolute; top: 12px; right: 12px; height: 30px; width: 30px; padding: 4px; border: none; font-size: 20px; cursor: pointer; border-radius: 50%;" type="button">
                    <i class="fa-solid fa-xmark"></i>
                </button>
                <button type="submit" class="button-normal-rd btn-green" id="solve-button" style="display: none; margin-top: 12px;">
                    Solve
                </button>
            </form>
            <div class="write-input">
                <span class="grey-text">No image? No problem. Write it down and we'll solve it step by step.</span>
                <a href="{{ route('write') }}" class="button-round btn-white-purple">Write and Solve</a>
            </div>
        </div>

        <div class="our-features">
            <div class="head">
                <span class="head-title-1">Our Features</span>
                <span class="head-title-2">A fresh new way to solve math problems</span>
            </div>
            <div class="content">
                <div class="card">
                    <div class="card-title">
                        <div class="title-logo">
                            <img src="{{ asset('images/step-by-step.webp') }}" alt="Step-by-Step Solutions">
                        </div>
                        <div class="title">Step-by-Step Solutions</div>
                    </div>
                    <span class="card-body">
                        No more confusion—understand every part of the problem with clear, detailed, and logical steps that guide you from question to solution.
                    </span>
                </div>
                <div class="card">
                    <div class="card-title">
                        <div class="title-logo">
                            <img src="{{ asset('images/foto-upload.webp') }}" alt="Upload and Solve">
                        </div>
                        <div class="title">Upload and Solve</div>
                    </div>
                    <span class="card-body">
                        Upload your math question, and get an instant solution—no typing required!
                    </span>
                </div>
                <div class="card">
                    <div class="card-title">
                        <div class="title-logo">
                            <img src="{{ asset('images/write.webp') }}" alt="Write and Solve">
                        </div>
                        <div class="title">Write and Solve</div>
                    </div>
                    <span class="card-body">
                        Write your problem directly on the screen—our system reads it instantly and solves it for you with precision.
                    </span>
                </div>
            </div>
        </div>
    </div>
</section>

@endsection

@push('scripts')
<script>
    // --- Helper Functions (Bisa diletakkan di file JS terpisah, misalnya app.js) ---
    function showElement(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.style.display = 'flex'; // Sesuaikan dengan display CSS Anda
        }
    }

    function hideElement(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.style.display = 'none';
        }
    }

    async function logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        alert('Anda telah logout.');
        // Redirect ke halaman login atau home setelah logout
        window.location.href = '{{ route('login') }}'; // Menggunakan route() Laravel
    }

    function scrollToCenter() {
        const inputGroupSection = document.getElementById('input-group');
        if (inputGroupSection) {
            inputGroupSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        console.log('Scrolling to center section...');
    }
    // --- Akhir Helper Functions ---

    document.addEventListener('DOMContentLoaded', async () => {
        // --- Image Upload/Preview Logic (Kode yang sudah ada) ---
        const uploadArea = document.getElementById('upload-area');
        const fileInput = document.getElementById('up-soal');
        const previewImage = document.getElementById('preview-image');
        const removeBtn = document.getElementById('remove-image');
        const uploadBtn = document.getElementById('up-button');
        const uploadText = uploadArea.querySelector('.text-drag');
        const solveBtn = document.getElementById('solve-button');
        const form = document.getElementById('upload-area');

        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

        // Drag Foto
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });
        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('dragover');
        });

        // Drop Foto
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                const file = files[0];
                if (allowedTypes.includes(file.type)) {
                    fileInput.files = files;
                    const event = new Event('change', { bubbles: true });
                    fileInput.dispatchEvent(event);
                } else {
                    alert('Hanya file gambar yang diperbolehkan (jpg, png, gif, webp).');
                }
            }
        });

        // Klik tombol upload
        uploadBtn.addEventListener('click', (e) => {
            e.preventDefault();
            fileInput.click();
        });

        // Klik area upload
        uploadArea.addEventListener('click', (e) => {
            if (e.target === fileInput || e.target === removeBtn || e.target.closest('#remove-image')) return;
            e.preventDefault();
            fileInput.click();
        });

        // Preview saat file dipilih
        fileInput.addEventListener('change', () => {
            const file = fileInput.files[0];
            if (file && allowedTypes.includes(file.type)) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    previewImage.src = e.target.result;
                    previewImage.style.display = 'block';
                    removeBtn.style.display = 'block';
                    solveBtn.style.display = 'inline-block';
                    uploadBtn.style.display = 'none';
                    uploadText.style.display = 'none';
                    fileInput.disabled = true;
                };
                reader.readAsDataURL(file);
            } else if (file) {
                alert('Hanya file gambar yang diperbolehkan (jpg, png, gif, webp).');
                fileInput.value = '';
            }
        });

        // Hapus gambar
        removeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            previewImage.src = '';
            previewImage.style.display = 'none';
            removeBtn.style.display = 'none';
            solveBtn.style.display = 'none';
            uploadBtn.style.display = 'block';
            uploadText.style.display = 'block';
            fileInput.value = '';
            fileInput.disabled = false;
        });

        // Kirim gambar ke server untuk diselesaikan
        solveBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            const file = fileInput.files[0];
            if (!file) {
                alert('Pilih file gambar terlebih dahulu');
                return;
            }

            const formData = new FormData();
            formData.append('image', file);

            const token = localStorage.getItem('token');
            const apiKey = document.querySelector('meta[name="api-key"]')?.getAttribute('content');

            try {
                const response = await fetch('/solve-from-image', {
                    method: 'POST',
                    headers: {
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                    },
                    body: formData
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => null);
                    throw new Error(errorData?.message || 'Gagal memproses gambar');
                }

                const solveData = await response.json();
                const latex = solveData.latex;

                // Decode string JSON dari field "answer"
                let parsedAnswer;
                try {
                    parsedAnswer = JSON.parse(solveData.answer);
                } catch (err) {
                    throw new Error("Format data 'answer' tidak valid");
                }

                const stepsList = parsedAnswer.steps.map(step => step.transformasi).join('\n');

                

                alert('Soal: ' + latex + '\nLangkah:\n' + stepsList);

                // Simpan ke backend jika login
                if (token && apiKey) {
                    const storeResponse = await fetch('http://localhost:3000/store', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'x-api-key': apiKey,
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            soal: latex,
                            langkahPenyelesaian: solveData.answer
                        })
                    });

                    const storeResult = await storeResponse.json();

                    if (storeResponse.ok) {
                        alert('Solusi berhasil disimpan!');
                    } else {
                        alert('Gagal menyimpan solusi.');
                        if (storeResponse.status === 401 || storeResponse.status === 403) {
                            console.log("Auth error saat menyimpan, logout...");
                            logout();
                        }
                    }
                } else {
                    console.log('User tidak login, skip simpan.');
                }

                localStorage.setItem('currentQuestion', latex);
                localStorage.setItem('currentSolutionSteps', solveData.answer);

                window.location.href = '{{ route("answer") }}';

            } catch (error) {
                alert(error.message);
            }
        });


        // --- Logic for Conditional Button Display (Register vs Go!) ---
        const registerButtonContainer = document.getElementById('registerButtonContainer');
        const goButtonContainer = document.getElementById('goButtonContainer');

        const token = localStorage.getItem('token');
        const userStored = localStorage.getItem('user');
        
        // Ambil API Key dari meta tag yang sudah kita tambahkan
        const apiKeyMeta = document.querySelector('meta[name="api-key"]');
        const apiKey = apiKeyMeta ? apiKeyMeta.getAttribute('content') : null;

        // Sembunyikan kedua tombol awal (Register & Go!)
        hideElement('registerButtonContainer');
        hideElement('goButtonContainer');

        if (token && userStored && apiKey) { // Pastikan ada token, user data, dan API key
            try {
                const user = JSON.parse(userStored);

                // Lakukan verifikasi token ke backend
                const response = await fetch(`http://localhost:3000/users/${user.id_user}`, {
                    method: 'GET',
                    headers: {
                        'x-api-key': apiKey,
                        'Authorization': `Bearer ${token}` 
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.status === 'success') {
                        // User terautentikasi dan data valid
                        console.log('User is logged in. Showing "Go!" button.');
                        showElement('goButtonContainer'); // Tampilkan tombol "Go!"
                    } else {
                        // Backend mengembalikan status 'fail' meskipun response.ok (jarang)
                        console.warn('Backend returned success status but validation failed. Showing "Register" button.');
                        localStorage.removeItem('token'); // Hapus token invalid
                        localStorage.removeItem('user');
                        showElement('registerButtonContainer'); // Tampilkan tombol "Register"
                    }
                } else {
                    // Token tidak valid, expired, atau error HTTP lainnya (misal 401 Unauthorized)
                    console.warn('Token invalid or expired. Clearing session and showing "Register" button.');
                    localStorage.removeItem('token'); // Hapus token invalid
                    localStorage.removeItem('user');
                    showElement('registerButtonContainer'); // Tampilkan tombol "Register"
                }
            } catch (error) {
                // Error jaringan atau parsing JSON
                console.error('Error during token verification:', error);
                localStorage.removeItem('token'); // Asumsikan sesi tidak valid
                localStorage.removeItem('user');
                showElement('registerButtonContainer'); // Tampilkan tombol "Register"
            }
        } else {
            // Tidak ada token, data user, atau API Key tidak ditemukan. User belum login.
            console.log('No token, user data, or API key found. Showing "Register" button.');
            showElement('registerButtonContainer'); // Tampilkan tombol "Register"
        }
    });
</script>
@endpush
