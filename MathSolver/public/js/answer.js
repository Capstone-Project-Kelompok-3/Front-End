// --------------- //
// Script SaveThis //
// --------------- //
function toggleBookmark(icon) {
    const isSaved = icon.classList.contains("fa-solid");

    if (isSaved) {
        icon.classList.remove("fa-solid");
        icon.classList.add("fa-regular");

        // TODO: Tambahkan logika batal simpan ke database di sini
        // Contoh:
        // fetch('/unsave', {
        //     method: 'POST',
        //     body: JSON.stringify({ id: 123 }),
        //     headers: { 'Content-Type': 'application/json' }
        // }).then(...);

    } else {
        icon.classList.remove("fa-regular");
        icon.classList.add("fa-solid");

        // TODO: Tambahkan logika simpan ke database di sini
        // Contoh:
        // fetch('/save', {
        //     method: 'POST',
        //     body: JSON.stringify({ id: 123 }),
        //     headers: { 'Content-Type': 'application/json' }
        // }).then(...);
    }
}

// ------------ //
// Script KaTex //
// ------------ //
// Fungsi untuk mengakhiri sesi dan mengarahkan ke halaman login
async function sesi_out() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    alert('Sesi Anda telah berakhir atau tidak valid. Silakan login kembali.');
    window.location.href = '/login'; // Pastikan rute ini benar
}

// Fungsi utama untuk memeriksa autentikasi dan memuat konten
async function checkAuthAndLoadContent() {
    const token = localStorage.getItem('token');
    const userStored = localStorage.getItem('user');
    const apiKeyMeta = document.querySelector('meta[name="api-key"]');
    const apiKey = apiKeyMeta ? apiKeyMeta.getAttribute('content') : null;

    // Jika tidak ada token, data user, atau API key, berarti belum login
    if (!token || !userStored || !apiKey) {
        console.log('Tidak ada token atau data user. Mengarahkan ke halaman login.');
        await sesi_out();
        return; // Hentikan eksekusi selanjutnya
    }

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

        // Jika token tidak valid, expired, atau error HTTP lainnya (misal 401 Unauthorized)
        if (!response.ok) {
            console.warn('Token invalid atau expired saat mengakses halaman answer. Mengarahkan ke login.');
            await sesi_out(); // Hapus token invalid dan redirect
            return; // Hentikan eksekusi selanjutnya
        }

        const data = await response.json();
        // Backend mengembalikan status 'fail' meskipun response.ok
        if (data.status !== 'success') {
            console.warn('Backend mengembalikan status "fail" saat memverifikasi user. Mengarahkan ke login.');
            await sesi_out(); // Hapus token dan redirect
            return; // Hentikan eksekusi selanjutnya
        }

        console.log('User terautentikasi. Memuat konten halaman answer.');

        const questionContainer = document.getElementById('question-container');
        const solutionContainer = document.getElementById('solution-container');

        // Periksa id_soal di URL terlebih dahulu
        const urlParams = new URLSearchParams(window.location.search);
        const id_soal = urlParams.get('id_soal');

        let displayQuestion = null;
        let displaySolutionSteps = null;

        if (id_soal) {
            // Jika id_soal ada, ambil dari backend
            try {
                const historyResponse = await fetch(`http://localhost:3000/history/${id_soal}`, {
                    method: 'GET',
                    headers: {
                        'x-api-key': apiKey,
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!historyResponse.ok) {
                    const errorData = await historyResponse.json().catch(() => null);
                    throw new Error(errorData?.message || `Gagal mengambil detail soal dari riwayat: ${historyResponse.statusText}`);
                }

                const historyData = await historyResponse.json();
                if (historyData.data) {
                    displayQuestion = historyData.data.soal;
                    displaySolutionSteps = historyData.data.langkah_penyelesaian;
                } else {
                    console.warn('Data riwayat tidak ditemukan untuk ID:', id_soal);
                    // Fallback ke localStorage jika ID dari history tidak menghasilkan data
                    displayQuestion = localStorage.getItem('currentQuestion');
                    displaySolutionSteps = localStorage.getItem('currentSolutionSteps');
                }

            } catch (error) {
                console.error('Error fetching history by ID:', error);
                alert(`Gagal memuat detail soal: ${error.message}`);
                // Fallback ke localStorage jika pengambilan dari ID gagal
                displayQuestion = localStorage.getItem('currentQuestion');
                displaySolutionSteps = localStorage.getItem('currentSolutionSteps');
            }
        } else {
            // Jika tidak ada id_soal, muat dari localStorage (dari halaman 'write')
            displayQuestion = localStorage.getItem('currentQuestion');
            displaySolutionSteps = localStorage.getItem('currentSolutionSteps');
        }

        // Tampilkan pertanyaan
        if (questionContainer && displayQuestion) {
            // Ubah karakter newline menjadi blok display math KaTeX untuk pertanyaan multi-baris
            const formattedQuestion = displayQuestion.split('\n').map(line => `$$${line.trim()}$$`).join('');
            questionContainer.innerHTML = `<div class="ques-item">${formattedQuestion}</div>`;
            if (typeof renderMathInElement === 'function') {
                renderMathInElement(questionContainer);
            }
        } else {
            questionContainer.innerHTML = '<div class="ques-item">Data pertanyaan tidak tersedia.</div>';
        }

        // Tampilkan langkah-langkah solusi
        if (solutionContainer && displaySolutionSteps) {
            const steps = displaySolutionSteps.split('\n').filter(step => step.trim() !== '');
            solutionContainer.innerHTML = '';
            steps.forEach(step => {
                const soluItem = document.createElement('div');
                soluItem.className = 'solu-item';
                // Bungkus setiap langkah dalam delimiter KaTeX inline
                soluItem.innerHTML = `\\(${step}\\)`;
                solutionContainer.appendChild(soluItem);
            });
            if (typeof renderMathInElement === 'function') {
                renderMathInElement(solutionContainer);
            }
        } else {
            solutionContainer.innerHTML = '<div class="solu-item">Langkah-langkah solusi tidak tersedia.</div>';
        }

        // Hapus data dari localStorage setelah konten dimuat (hanya jika dimuat dari localStorage)
        if (!id_soal) { // Jika itu adalah penyelesaian baru (bukan dari ID history)
            localStorage.removeItem('currentQuestion');
            localStorage.removeItem('currentSolutionSteps');
        }

    } catch (error) {
        console.error('Error selama pemeriksaan autentikasi atau pemuatan konten:', error);
        await sesi_out(); // Arahkan ke login
    }
}

document.addEventListener('DOMContentLoaded', checkAuthAndLoadContent);


// Fungsi untuk bookmark (tetap di sini)
// window.toggleBookmark = function(element) {
//     element.classList.toggle('fa-solid');
//     element.classList.toggle('fa-regular');
//     alert('Bookmark functionality to be implemented!');
// };