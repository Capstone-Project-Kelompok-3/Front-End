// --- Helper Functions (for Authentication) ---
// These functions are critical for authentication and can be shared across multiple scripts.
// Consider putting them in a separate, globally accessible file (e.g., app.js)
// if you find yourself duplicating them.
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
            // If the response is not OK (e.g., 401, 403) or backend explicitly says 'fail'
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
    // This will redirect to login if the user is not authenticated.
    const isAuthenticated = await checkAuthStatus();
    if (!isAuthenticated) {
        return; // Stop further execution if not authenticated
    }

    const container = document.getElementById("math-container"); // This is the container for math-field elements
    const btnNew = document.getElementById("btn-new");
    const btnReset = document.getElementById("btn-reset");
    const btnSolve = document.getElementById("btn-solve");
    // const solutionOutput = document.getElementById("solution-output"); // This is commented out in HTML, so we won't use it directly here for display.

    // Initial check for MathLive connectivity
    if (typeof MathLive === 'undefined' || !MathLive.MathField) {
        document.getElementById('no-internet').style.display = 'block';
    } else {
        document.getElementById('no-internet').style.display = 'none';
    }

    // Function to add a new math field
    function addMathField() {
        const mathField = document.createElement("math-field");
        mathField.setAttribute("virtual-keyboard-mode", "onfocus");
        mathField.setAttribute("virtual-keyboards", "all");
        mathField.classList.add("custom-math-field"); // Add a class for easier selection if needed
        container.appendChild(mathField);

        mathField.addEventListener("focus", () => {
            mathField.executeCommand("showVirtualKeyboard");
        });

        mathField.focus(); // Focus the newly added field

        mathField.addEventListener("keydown", function(event) {
            if (event.key === "Enter") {
                event.preventDefault(); // Prevent default Enter behavior

                const allFields = container.querySelectorAll("math-field");
                const currentIndex = Array.from(allFields).indexOf(mathField);

                if (currentIndex < allFields.length - 1) {
                    // If there's a next field, focus it
                    allFields[currentIndex + 1].focus();
                } else {
                    // If this is the last field, add a new one
                    addMathField();
                }
            }
        });
    }

    // Event listener for "New Line" button - REMAINS UNCHANGED
    btnNew.addEventListener("click", addMathField);

    // Event listener for "Reset" button - REMAINS UNCHANGED
    btnReset.addEventListener("click", () => {
        container.innerHTML = ''; // Clear all dynamically added fields
        addMathField(); // Add one new math field to start over
    });

    /// IMPORTANT: THE `btnSolve` LOGIC IS MODIFIED TO REDIRECT TO ANSWER PAGE
    btnSolve.addEventListener("click", async () => {
        const fields = container.querySelectorAll("math-field");
        const latexList = Array.from(fields).map(field => field.getValue("latex").trim()).filter(value => value !== '');

        if (latexList.length === 0) {
            alert('Harap masukkan soal matematika terlebih dahulu.');
            return;
        }

        // Combine all latex inputs into a single string for storage as the question
        const combinedQuestionLatex = latexList.join('\n');


        const token = localStorage.getItem('token');
        const apiKey = document.querySelector('meta[name="api-key"]').getAttribute('content');
        const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute("content"); // Get CSRF token for Laravel backend if needed

        // Add loading state
        btnSolve.textContent = 'Memecahkan...';
        btnSolve.disabled = true;

        try {
            // 1. Fetch to your Laravel backend's /solve endpoint (as per your existing code)
            const solveResponse = await fetch("/solve", { // This URL must be correct for your Laravel route
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": csrfToken // Laravel's CSRF token
                },
                body: JSON.stringify({ expressions: latexList }) // Send as an array of expressions
            });

            if (!solveResponse.ok) {
                const errorData = await solveResponse.json().catch(() => null);
                throw new Error(errorData?.message || `Gagal memproses soal: ${solveResponse.statusText}`);
            }

            const data = await solveResponse.json();
            console.log("Response data from /solve:", data);

            let solutionStepsText = ''; // This will hold the combined steps as a plain string

            // Extract relevant data for storage (soal and langkahPenyelesaian)
            // Assuming the /solve endpoint returns data in a structure that can be converted to steps
            // This part mimics how your original `solution-output` display built the steps.
            if (data.solutions && Array.isArray(data.solutions)) {
                data.solutions.forEach((solution) => {
                    let steps = solution.steps || [];
                    if (typeof steps === "string") {
                        try {
                            steps = JSON.parse(steps);
                        } catch (e) {
                            console.warn("Gagal parsing steps:", e);
                            steps = [];
                        }
                    }
                    steps.forEach(step => {
                        if (typeof step === "string") {
                            solutionStepsText += step + '\n';
                        } else if (typeof step === "object" && step !== null) {
                            solutionStepsText += `Langkah ${step.langkah}: ${step.transformasi} - Operasi: ${step.operasi}\n`;
                        }
                    });
                });
            } else if (data.result || data.steps) {
                let steps = data.steps || [];
                if (typeof steps === "string") {
                    try {
                        steps = JSON.parse(steps);
                    } catch (e) {
                        console.warn("Gagal parsing steps:", e);
                        steps = [];
                    }
                }
                steps.forEach(step => {
                    if (typeof step === "string") {
                        solutionStepsText += step + '\n';
                    } else if (typeof step === "object" && step !== null) {
                        solutionStepsText += `Langkah ${step.langkah}: ${step.transformasi} - Operasi: ${step.operasi}\n`;
                    }
                });
            } else {
                console.warn("Respons solusi tidak memiliki format yang diharapkan (solutions array atau result/steps langsung).");
                solutionStepsText = "Tidak ada langkah penyelesaian yang tersedia.";
            }

            // Clean up any trailing newlines
            solutionStepsText = solutionStepsText.trim();

            // 2. Store solved data to your backend's /store endpoint (Node.js/Hapi.js)
            if (token && apiKey) { // Only attempt to store if user is logged in
                try {
                    const storeResponse = await fetch('http://localhost:3000/store', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'x-api-key': apiKey,
                            'Authorization': `Bearer ${token}` // Endpoint /store requires auth
                        },
                        body: JSON.stringify({
                            soal: combinedQuestionLatex, // The combined original question LaTeX
                            langkahPenyelesaian: solutionStepsText // The combined solution steps as a string
                        })
                    });

                    const storeResult = await storeResponse.json();

                    if (storeResponse.ok) {
                        console.log('Data soal dan solusi berhasil disimpan di backend via /store:', storeResult.message);
                    } else {
                        console.error('Gagal menyimpan data soal dan solusi di backend via /store:', storeResult.message || 'Error tidak diketahui.');
                        if (storeResponse.status === 401 || storeResponse.status === 403) {
                            console.log("Masalah autentikasi saat menyimpan via /store. Mengarahkan ke login.");
                            await logout();
                            return; // Stop further execution
                        }
                    }
                } catch (storeError) {
                    console.error('Kesalahan jaringan saat menyimpan data ke backend via /store:', storeError);
                }
            } else {
                console.log('Pengguna tidak login, melewati penyimpanan solusi ke backend.');
            }

            // 3. Store data to localStorage for the Answer page
            localStorage.setItem('currentQuestion', combinedQuestionLatex);
            localStorage.setItem('currentSolutionSteps', solutionStepsText);

            // 4. Redirect to the Answer page
            window.location.href = '/answer';

        } catch (error) {
            alert(error.message);
            console.error('Error saat memecahkan/menyimpan soal:', error);
        } finally {
            btnSolve.textContent = 'Solve'; // Reset button text
            btnSolve.disabled = false; // Re-enable button
        }
    });

    // Initial call to add one math field when the page loads
    // This ensures there's always at least one input field available.
    addMathField();
});
