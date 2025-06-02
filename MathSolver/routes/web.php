<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MathController;


Route::get('/login', function () {
    return view('auth.login');
})->name('login');

Route::post('/login', function (Request $request) {
    // Untuk sementara, tampilkan input email & password
    // return 'Email: ' . $request->input('email-login') . '<br>Password: ' . $request->input('password');
    return view('pages.home');
})->name('login-submit');

Route::get('/register', function () {
    return view('auth.register');
})->name('register');

Route::post('/register', function (Request $request) {
    // Untuk sementara, tampilkan input email & password
    // return 'Name: ' . $request->input('name') . '<br>Email: ' . $request->input('email-reg') . '<br>Password: ' . $request->input('password');
    return view('pages.home');
})->name('register-submit');

Route::get('/', function () {
    return view('pages.home');
})->name('home');

Route::get('/write-question', function () {
    return view('pages.writequestion');
})->name('write');

Route::get('/answer', function () {
    return view('pages.answer');
})->name('answer');

Route::get('/save-history', function () {
    return view('pages.savehistory');
})->name('saved');

Route::post('/solve-from-image', [MathController::class, 'solveFromImage']);
Route::post('/solve', [MathController::class, 'solve']);