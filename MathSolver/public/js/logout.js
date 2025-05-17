        // ------------- //
        // Script Logout //
        // ------------- //
        // Toggle overlay menu
        function toggleOverlay() {
            const overlay = document.getElementById("profilOverlay");
            overlay.style.display = (overlay.style.display === "block") ? "none" : "block";
        }

        // Log out action
        function logout() {
            alert("Logged out!");
            // window.location.href = "logout.php"; // atau ke halaman logout sebenarnya
        }

        // Optional: click di luar overlay menutupnya
        document.addEventListener("click", function(event) {
            const profilArea = document.querySelector(".profil-area");
            const overlay = document.getElementById("profilOverlay");
            if (!profilArea.contains(event.target)) {
                overlay.style.display = "none";
            }
        });