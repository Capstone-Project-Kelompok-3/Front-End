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

            // Jika ingin simpan sementara (optional):
            // $path = $file->store('uploads');
            // Log::info("File uploaded saved at: " . $path);

            // Kirim file ke API Flask dengan multipart/form-data
            $response = Http::attach(
                'image',
                file_get_contents($file->getRealPath()),
                $file->getClientOriginalName()
            )->post('http://127.0.0.1:5001/solve-image');

            // Logging untuk debugging
            Log::info('Response status: ' . $response->status());
            Log::info('Response body: ' . $response->body());

            // Pastikan response sukses dan valid JSON
            if ($response->successful()) {
                $jsonData = $response->json();

                // Contoh validasi response minimal
                if (!isset($jsonData['latex']) || !isset($jsonData['solution_steps'])) {
                    return response()->json([
                        'error' => 'Response API tidak valid',
                        'data' => $jsonData,
                    ], 500);
                }

                // Response sukses
                return response()->json($jsonData);

            } else {
                // Response gagal dari API Flask
                return response()->json([
                    'error' => 'Gagal memproses gambar',
                    'status' => $response->status(),
                    'body' => $response->body(),
                ], 500);
            }
        } catch (\Exception $e) {
            // Tangkap error unexpected dan log
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
            // Kirim teks latex ke API Flask
            $response = Http::post('http://127.0.0.1:5001/solve-text', [
                'latex' => $expr
            ]);

            if ($response->successful()) {
                $jsonData = $response->json();

                // Ambil jawaban dan langkah dari response API Flask
                $solutions[] = [
                    'answer' => $jsonData['solution_steps'] ?? 'Tidak ada solusi',
                    'steps' => explode("\n", $jsonData['solution_steps'] ?? '')
                ];
            } else {
                // Jika gagal, gunakan fallback dummy
                $solutions[] = [
                    'answer' => 'Gagal mendapatkan solusi dari API',
                    'steps' => []
                ];
            }
        }

        return response()->json(['solutions' => $solutions]);
    }

}
