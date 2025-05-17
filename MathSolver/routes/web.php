<?php

use Illuminate\Support\Facades\Route;

Route::get('/login', function () {
    return view('auth.login');
});
Route::get('/register', function () {
    return view('auth.register');
});
Route::get('/', function () {
    return view('pages.home');
});
Route::get('/write-question', function () {
    return view('pages.writequestion');
});
Route::get('/answer', function () {
    return view('pages.answer');
});
Route::get('/save-history', function () {
    return view('pages.savehistory');
});