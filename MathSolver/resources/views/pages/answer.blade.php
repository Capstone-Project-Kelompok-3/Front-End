@extends('layouts/mainlayout')

@section('title', 'Answer')
@section('description', 'Selamat datang di situs kami, website untuk menyelesaikan soal matematika')
@section('keywords', 'langkah-langkah, matematika, website')
@section('author', 'MathSolver Dev')

@push('others-links')
    <!-- head link -->
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
        .katex { font: inherit; }
    </style>
@endpush

@section('content')
    <!-- Content HTML -->
    <section class="answer">
        <div class="main">
            <div class="navigation">
                <button onclick="location.href='home.html'" class="button-small btn-red">
                    <i title="back" class="fa fa-chevron-left"></i> Back
                </button>
            </div>
            <div class="content">
                <div class="ques-group">
                    <div class="title">
                        Question
                        <i title="Save" onclick="toggleBookmark(this)" class="fa-regular fa-bookmark"></i>
                    </div>
                    <div class="ques-detail" id="question-container">
                        <!-- <div class="ques-item"></div> -->
                    </div>
                </div>
                <div class="solu-group">
                    <div class="title">Solution</div>
                    <div class="solu-detail"  id="solution-container">
                        <!-- Data Langkah-langkah solusi Ada Disini -->
                        <!-- <div class="solu-item"></div> -->
                    </div>
                </div>
                <div class="answ-group">
                    <div class="title">Answer</div>
                    <div class="answ-detail" id="answer-container">
                        <!-- <div class="answ-item"></div> -->
                    </div>
                </div>
            </div>
        </div>
    </section>
@endsection

@push('scripts')
    <!-- JavaScript -->
    <script src="{{ asset('js/answer.js') }}"></script>
@endpush