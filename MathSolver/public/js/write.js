        // --------------- //
        // Script Mathlive //
        // --------------- //
        document.addEventListener("DOMContentLoaded", () => {
            const container = document.getElementById("math-container");
            const btnNew = document.getElementById("btn-new");
            const btnReset = document.getElementById("btn-reset");
            const btnSolve = document.getElementById("btn-solve");

            function addMathField() {
                const mathField = document.createElement("math-field");
                mathField.setAttribute("virtual-keyboard-mode", "onfocus");
                mathField.setAttribute("virtual-keyboards", "all");
                mathField.classList.add("custom-math-field");
                container.appendChild(mathField);

                // Tambahkan event listener untuk buka keyboard
                mathField.addEventListener("focus", () => {
                    mathField.executeCommand("showVirtualKeyboard");
                });

                mathField.focus();

                // Tambahkan event listener untuk menangani tombol "Enter"
                mathField.addEventListener("keydown", function(event) {
                    if (event.key === "Enter") {
                        event.preventDefault(); // Menghindari enter dari melakukan aksi default

                        // Cek apakah ini field terakhir
                        const allFields = container.querySelectorAll("math-field");
                        const currentIndex = Array.from(allFields).indexOf(mathField);

                        // Jika bukan field terakhir, pindah ke field berikutnya
                        if (currentIndex < allFields.length - 1) {
                            allFields[currentIndex + 1].focus();
                        } else {
                            // Jika field terakhir, lakukan tambah baru
                            addMathField();
                        }
                    }
                });
            }

            btnNew.addEventListener("click", addMathField);

            btnReset.addEventListener("click", () => {
                container.innerHTML = '';

                addMathField();
            });

        btnSolve.addEventListener("click", () => {
            const fields = container.querySelectorAll("math-field");
            const latexList = Array.from(fields).map(field => field.getValue("latex"));
        
            fetch("/solve", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').getAttribute("content")
                },
                body: JSON.stringify({ expressions: latexList })
            })
            .then(response => response.json())
            .then(data => {
                const outputDiv = document.getElementById("solution-output");
                outputDiv.innerHTML = "";
            
                data.solutions.forEach((solution, index) => {
                    const html = `
                        <div class="solution" style="margin-bottom: 20px;">
                            <h4>Soal ${index + 1}</h4>
                            <p><strong>Jawaban:</strong> ${solution.answer}</p>
                            <p><strong>Langkah-langkah:</strong></p>
                            <ol>${solution.steps.map(step => `<li>${step}</li>`).join("")}</ol>
                        </div>
                    `;
                    outputDiv.innerHTML += html;
                });
            })
            .catch(error => {
                console.error("Gagal memproses soal:", error);
            });
        });
            // Tambahkan math-field pertama saat halaman dimuat
            addMathField();
        });