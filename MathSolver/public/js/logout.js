        // ------------- //
        // Script Logout //
        // ------------- //

        // Helper functions
        function showElement(elementId) {
            const element = document.getElementById(elementId);
            if (element) {
                element.style.display = 'flex'; // Sesuaikan dengan display CSS yang Anda inginkan (misalnya 'block', 'flex', 'grid')
            }
        }

        function hideElement(elementId) {
            const element = document.getElementById(elementId);
            if (element) {
                element.style.display = 'none';
            }
        }

        // Function to handle logout
        async function logout() {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            alert('Anda telah logout.');
            // Redirect ke halaman login atau home setelah logout
            window.location.href = '/login'; // Ganti dengan route login Anda jika tidak menggunakan Laravel route() di JS
        }
        
        // Toggle overlay menu
        function toggleOverlay() {
            const overlay = document.getElementById("profilOverlay");
            overlay.style.display = (overlay.style.display === "block") ? "none" : "block";
        }

        // Optional: click di luar overlay menutupnya
        document.addEventListener("click", function(event) {
            const profilArea = document.querySelector(".profil-area");
            const overlay = document.getElementById("profilOverlay");
            if (!profilArea.contains(event.target)) {
                overlay.style.display = "none";
            }
        });

        // Main logic to check authentication status and update header
        document.addEventListener('DOMContentLoaded', async () => {
            const headerAuthButtons = document.getElementById('headerAuthButtons');
            const headerProfileArea = document.getElementById('headerProfileArea');
            const headerUserNameDisplay = document.getElementById('headerUserNameDisplay');

            // Sembunyikan kedua area header secara default
            hideElement('headerAuthButtons');
            hideElement('headerProfileArea');

            const token = localStorage.getItem('token');
            const userStored = localStorage.getItem('user');

            // Ambil API Key dari meta tag
            const apiKeyMeta = document.querySelector('meta[name="api-key"]');
            const apiKey = apiKeyMeta ? apiKeyMeta.getAttribute('content') : null;

            if (token && userStored && apiKey) {
                try {
                    const user = JSON.parse(userStored);

                    // Verifikasi token ke backend
                    const response = await fetch(`http://localhost:3000/users/${user.id_user}`, {
                        method: 'GET',
                        headers: {
                            'x-api-key': apiKey,
                            'Authorization': `Bearer ${token}` // Kirim token di header Authorization
                        }
                    });

                    if (response.ok) {
                        const data = await response.json();
                        if (data.status === 'success') {
                            // Token valid, user terautentikasi
                            headerUserNameDisplay.textContent = data.data.nama; // Update nama user
                            showElement('headerProfileArea'); // Tampilkan area profil
                        } else {
                            // Backend mengembalikan status 'fail' meskipun 2xx (jarang)
                            console.warn('Backend returned success status but login failed. Clearing session.');
                            localStorage.removeItem('token');
                            localStorage.removeItem('user');
                            showElement('headerAuthButtons'); // Tampilkan tombol login/signup
                        }
                    } else {
                        // Token tidak valid atau expired (e.g., 401 Unauthorized, 404 Not Found)
                        console.warn('Token invalid or expired. Clearing session and showing auth buttons.');
                        localStorage.removeItem('token');
                        localStorage.removeItem('user');
                        showElement('headerAuthButtons'); // Tampilkan tombol login/signup
                    }
                } catch (error) {
                    // Error jaringan atau parsing JSON
                    console.error('Error during token verification:', error);
                    localStorage.removeItem('token'); // Asumsikan sesi tidak valid
                    localStorage.removeItem('user');
                    showElement('headerAuthButtons'); // Tampilkan tombol login/signup
                }
            } else {
                // Tidak ada token, data user, atau API Key tidak ditemukan
                console.log('No token, user data, or API key found. Showing auth buttons.');
                showElement('headerAuthButtons'); // Tampilkan tombol login/signup
            }
        });