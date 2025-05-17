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
                fields.forEach((field, i) => {
                    const latex = field.getValue("latex");
                    // alert(`Ekspresi ${i + 1}: ${latex}`);
                    console.log(`Ekspresi ${i + 1}: ${latex}`);
                });
            });

            // Tambahkan math-field pertama saat halaman dimuat
            addMathField();
        });