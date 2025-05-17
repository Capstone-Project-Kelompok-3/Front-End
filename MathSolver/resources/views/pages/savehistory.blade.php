@extends('layouts/mainlayout')

@section('title', 'Saved and History')
@section('description', 'Selamat datang di situs kami, website untuk menyelesaikan soal matematika')
@section('keywords', 'langkah-langkah, matematika, website')
@section('author', 'MathSolver Dev')

@push('others-links')
    <!-- head link -->
    <!-- KaTeX -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css">
    <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.js"></script>
    <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/contrib/auto-render.min.js"
        onload="renderMathInElement(document.body, {
            delimiters: [
                {left: '$$', right: '$$', display: true},
                {left: '\\(', right: '\\)', display: false}
            ]
        });">
    </script>
    <style>
        .katex { padding-left: 8px; padding-right: 8px; font: inherit; }
    </style>
@endpush

@section('content')
    <!-- Content HTML -->
    <section class="savehistory">
        <div class="main">
            <div class="navigation">
                <button onclick="location.href='home.html'" class="button-small btn-red">
                    <i title="back" class="fa fa-chevron-left"></i> Back
                </button>
            </div>
            <div class="content">
                <div class="saved-group" id="saved-group">
                    <div class="title">Saved</div>
                    <div class="saved-detail"  id="saved-container">
                        <!-- Data Soal Tersimpan Ada Disini -->
                    </div>
                </div>
                <div class="history-group" id="history-group">
                    <div class="title">History</div>
                    <div class="history-detail" id="history-container">
                        <!-- Data Riwayat Soal Ada Disini -->
                    </div>
                </div>
            </div>
        </div>
    </section>
@endsection

@push('scripts')
    <!-- JavaScript -->
         <script src="{{ asset('js/savehistory.js') }}"></script>

@endpush