// public/js/savehistory.js

// --- Helper Functions for Authentication ---
async function sesi_out() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    alert('Sesi Anda telah berakhir atau tidak valid. Silakan login kembali.');
    window.location.href = '/login'; // Ensure this route matches your Laravel login route
}

// Function to check authentication status with the backend
async function checkAuthStatus() {
    const token = localStorage.getItem('token');
    const userStored = localStorage.getItem('user');
    const apiKeyMeta = document.querySelector('meta[name="api-key"]');
    const apiKey = apiKeyMeta ? apiKeyMeta.getAttribute('content') : null;

    if (!token || !userStored || !apiKey) {
        console.log('Tidak ada token, data user, atau API key ditemukan. Mengarahkan ke login.');
        await sesi_out();
        return false; // Not authenticated
    }

    try {
        const user = JSON.parse(userStored);
        // Verify the token with your backend user endpoint
        const response = await fetch(`http://localhost:3000/users/${user.id_user}`, {
            method: 'GET',
            headers: {
                'x-api-key': apiKey,
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (!response.ok || data.status !== 'success') {
            console.warn('Token invalid atau expired saat pemeriksaan autentikasi. Mengarahkan ke login.');
            await sesi_out();
            return false; // Not authenticated
        }
        console.log('Pengguna terautentikasi berhasil.');
        return true; // User is authenticated
    } catch (error) {
        console.error('Terjadi kesalahan selama pemeriksaan autentikasi:', error);
        await sesi_out();
        return false; // Authentication failed due to network error or other issue
    }
}
// --- End Helper Functions ---


document.addEventListener("DOMContentLoaded", async () => {
    // Perform authentication check when the page loads
    const isAuthenticated = await checkAuthStatus();
    if (!isAuthenticated) {
        return; // Stop further execution if not authenticated
    }

    const savedContainer = document.getElementById("saved-container");
    const historyContainer = document.getElementById("history-container");
    const token = localStorage.getItem('token');
    const apiKey = document.querySelector('meta[name="api-key"]').getAttribute('content');

    // Function to render the list of questions
    function renderQuestionList(containerElement, dataArray, type) {
        containerElement.innerHTML = ''; // Clear existing content

        if (dataArray.length === 0) {
            containerElement.innerHTML = `<p style="text-align: center; padding: 20px; color: #888; font-size: 16px;">Tidak ada ${type} yang tersedia.</p>`;
            return;
        }

        dataArray.forEach(item => {
            // Ensure `soal` is a string or handle arrays correctly if your backend sends it as such
            // Based on your backend, `soal` is a string (math probe text)
            // If it can contain multiple lines joined by '\n', then split it for display.
            const displayQuestion = item.soal.replace(/\\n/g, ' | '); // Replace actual newlines with " | " for display

            const date = new Date(item.waktu_input).toLocaleDateString('id-ID', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }); // Format date

            const html = `
                <div onclick="redirectToAnswer('${item.id_soal}')" class="${type}-item">
                    <div class="date">${date}</div>
                    <div class="question">
                        <div class="ques" style="font-weight: bold;">Question:</div>
                        <div class="ques-text">${displayQuestion}</div>
                    </div>
                </div>
            `;
            containerElement.innerHTML += html;
        });

        // After rendering, apply KaTeX
        if (typeof renderMathInElement === 'function') {
            renderMathInElement(containerElement, { // Render only in the specific container
                delimiters: [
                    { left: '$$', right: '$$', display: true },
                    { left: '\\(', right: '\\)', display: false }
                ]
            });
        }
    }

    // Function to redirect to the answer page with the question ID
    window.redirectToAnswer = (id_soal) => {
        // Store the ID in localStorage or directly use it in the URL
        // We'll fetch the full details on the answer page using this ID
        window.location.href = `/answer?id_soal=${id_soal}`;
    };

    // Fetch history data from the backend
    async function fetchHistory() {
        if (!token || !apiKey) {
            console.error("Token atau API Key tidak tersedia. Tidak dapat mengambil riwayat.");
            await sesi_out();
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/history', {
                method: 'GET',
                headers: {
                    'x-api-key': apiKey,
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.message || `Gagal mengambil riwayat: ${response.statusText}`);
            }

            const result = await response.json();
            console.log("History API Response:", result.data);

            // Assuming your backend response 'data' contains both saved and history
            // Your `getUserHistory` function likely returns an array of history items.
            // If your backend distinguishes between 'saved' and 'history' (e.g., a 'is_saved' flag),
            // you'd filter them here. For now, we'll treat all as "History" and show them.
            // If you have a separate endpoint for "Saved" or a flag in the data, adjust this.
            // For this integration, we'll assume `getUserHistory` returns all relevant items.

            // Split into saved and history based on a hypothetical 'is_saved' property
            const allItems = result.data || [];
            // const savedItems = allItems.filter(item => item.is_saved); // Assuming `is_saved` property
            const historyItems = allItems.filter(item => !item.is_saved); // Assuming `is_saved` property

            // If your backend only returns one type (e.g., all are history), you'd use:
            // const historyItems = allItems;
            // const savedItems = []; // Or fetch from a different endpoint

            // renderQuestionList(savedContainer, savedItems, "saved");
            renderQuestionList(historyContainer, historyItems, "history");

        } catch (error) {
            console.error("Terjadi kesalahan saat mengambil riwayat:", error);
            alert(`Gagal memuat riwayat: ${error.message}`);
            // Optionally, clear containers if fetching fails
            savedContainer.innerHTML = `<p style="text-align: center; color: #AF0000;">Gagal memuat daftar tersimpan.</p>`;
            historyContainer.innerHTML = `<p style="text-align: center; color: #AF0000;">Gagal memuat daftar riwayat.</p>`;
        }
    }

    // Call fetchHistory to load data when the page is ready
    fetchHistory();
});