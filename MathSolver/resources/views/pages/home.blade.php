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
                        <span class="title-1 white-text">Start Solving MATH <span class="green-text">in Easy Way</span></span>
                        <span class="title-2">Struggling with math problems? Find the solution here!</span>
                    </div>
                    <!-- Bila Belum Login -->
                    <!-- <button onclick="location.href='register.html'" class="button-normal btn-green">Register</button> -->
                    <!-- Bila Sudah Login -->
                    <button onclick="scrollToCenter()" class="button-normal btn-green">Go!</button>
                    
                </div>
                <div class="illustration">
                    <img src="{{ asset('images/illustration.webp') }}" alt="MathSolver Ilustration">
                </div>
            </div>
            <div class="input-group" id="input-group">
                <form class="upload-area" id="upload-area" enctype="multipart/form-data">
                    <input type="file" name="up-soal" id="up-soal" style="display: none;">
                    <button id="up-button" class="button-normal-rd btn-blue">Upload Image</button>
                    <span class="text-drag">or drop a photo here</span>
                    <img id="preview-image" style="display: none; max-height: 200px; margin-top: 16px; border-radius: 12px;" />
                    <button class="button-round btn-red" id="remove-image" style="display: none; position: absolute; top: 12px; right: 12px; height: 30px; width: 30px; padding: 4px; border: none; font-size: 20px; cursor: pointer; border-radius: 50%;">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                    <button type="submit" class="button-normal-rd btn-green" id="solve-button" style="display: none; margin-top: 12px;">
                        Solve
                    </button>
                </form>
                <div class="write-input">
                    <span class="grey-text">No image? No problem. Write it down and we'll solve it step by step.</span>
                    <a href="writequestion.html" class="button-round btn-white-purple">Write and Solve</a>
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
    <script src="{{ asset('js/home.js') }}"></script>
@endpush