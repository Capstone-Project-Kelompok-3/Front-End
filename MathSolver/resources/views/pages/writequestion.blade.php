@extends('layouts/mainlayout')

@section('title', 'Write Question')
@section('description', 'Selamat datang di situs kami, website untuk menyelesaikan soal matematika')
@section('keywords', 'langkah-langkah, matematika, website')
@section('author', 'MathSolver Dev')

@push('others-links')
    <!-- MathLive -->
    <link rel="stylesheet" href="https://unpkg.com/mathlive/dist/mathlive.core.css">
    <link rel="stylesheet" href="https://unpkg.com/mathlive/dist/mathlive.css">
    <script src="https://unpkg.com/mathlive"></script>
    <style>
        math-field {
            display: block;
            width: 100%;
            padding: 0 10px;
            font-family: inherit;
            font-size: 24px;
            border-radius: 8px;
            border: 2px solid #E2E2E2;
            cursor: text;
        }
    </style>
@endpush

@section('content')
    <!-- Content HTML -->
    <section class="write">
        <div class="main">
            <div class="navigation">
                <button onclick="location.href='home.html'" class="button-small btn-red">
                    <i class="fa fa-chevron-left"></i> Back
                </button>
            </div>
            <div class="input-container">
                <div class="write">
                    <div class="input-tool">
                        <button id="btn-new" class="button-sm-sm btn-blue" style="border: 2px solid #4e57d4;">New Line</button>
                        <button id="btn-reset" class="button-sm-sm btn-red">Reset</button>
                        <button id="btn-solve" class="button-sm-sm btn-white-purple">Solve</button>
                    </div>
                </div>
                <div class="math-container" id="math-container"></div>
            </div>
            <span id="no-internet" style="width: 100%; padding: 0 105px 0; font-size: 12px; color: #AF0000; font-weight: bold;">
                * Input MathLive mungkin tidak berfungsi bila tidak ada internet.
            </span>
        </div>
    </section>
@endsection

@push('scripts')
    <!-- JavaScript -->
    <script src="{{ asset('js/write.js') }}"></script>
@endpush