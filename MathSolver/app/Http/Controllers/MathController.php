<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class MathController extends Controller
{
    public function solveFromImage(Request $request)
    {
        // Validasi input gambar
        $request->validate([
            'image' => 'required|image|max:5120' // max 5MB
        ]);

        try {
            $file = $request->file('image');

            // Kirim file ke API Flask dengan multipart/form-data
            $response = Http::attach(
                'image',
                file_get_contents($file->getRealPath()),
                $file->getClientOriginalName()
            )->post('http://127.0.0.1:5001/solve-image');

            // Logging untuk debugging
            Log::info('Response status: ' . $response->status());
            Log::info('Response body: ' . $response->body());

            if ($response->successful()) {
                $jsonData = $response->json();

                if (!isset($jsonData['latex']) || (!isset($jsonData['solution_steps']) && !isset($jsonData['result']))) {
                    return response()->json([
                        'error' => 'Response API tidak valid',
                        'data' => $jsonData,
                    ], 500);
                }

                $answer = $jsonData['result'] ?? ($jsonData['solution_steps'] ?? 'Tidak ada hasil');
                $steps = [];

                if (isset($jsonData['solution_steps'])) {
                    $steps = explode("\n", $jsonData['solution_steps']);
                } elseif (isset($jsonData['result'])) {
                    $steps = [$jsonData['result']];
                }

                return response()->json([
                    'latex' => $jsonData['latex'],
                    'answer' => $answer,
                    'steps' => $steps
                ]);
            } else {
                return response()->json([
                    'error' => 'Gagal memproses gambar',
                    'status' => $response->status(),
                    'body' => $response->body(),
                ], 500);
            }
        } catch (\Exception $e) {
            Log::error('Exception saat memproses gambar: ' . $e->getMessage());

            return response()->json([
                'error' => 'Terjadi kesalahan saat memproses gambar',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function solve(Request $request)
    {
        $expressions = $request->input('expressions', []);
        $solutions = [];

        foreach ($expressions as $expr) {
            $response = Http::post('http://127.0.0.1:5001/solve-text', [
                'latex' => $expr
            ]);

            if ($response->successful()) {
                $jsonData = $response->json();

                $answer = $jsonData['result'] ?? ($jsonData['solution_steps'] ?? 'Tidak ada hasil');
                $steps = [];

                if (isset($jsonData['solution_steps'])) {
                    $steps = explode("\n", $jsonData['solution_steps']);
                } elseif (isset($jsonData['result'])) {
                    $steps = [$jsonData['result']];
                }

                $solutions[] = [
                    'answer' => $answer,
                    'steps' => $steps
                ];
            } else {
                $solutions[] = [
                    'answer' => 'Gagal mendapatkan solusi dari API',
                    'steps' => []
                ];
            }
        }

        return response()->json(['solutions' => $solutions]);
    }
}
