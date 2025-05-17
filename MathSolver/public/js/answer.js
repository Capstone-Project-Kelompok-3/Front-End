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

        // Contoh data dari backend (bisa diganti fetch/ajax nanti)
        const mathData = {
            question: ["Selesaikan persamaan berikut:", "\\( 2x + 4 = 12 \\)"],
            steps: [
                "Langkah 1: Kurangi kedua sisi dengan 4: \\( 2x + 4 - 4 = 12 - 4 \\)",
                "Langkah 2: Hasilnya adalah \\( 2x = 8 \\)",
                "Langkah 3: Bagi kedua sisi dengan 2: \\( x = \\frac{8}{2} \\)"
            ],
            answer: ["\\( x = 4 \\)"]
        };

        // Masukkan ke HTML
        // document.getElementById("question-container").innerHTML = `
        //     <div class="ques-item">${mathData.question}</div>
        // `;
        const questionHTML = mathData.question.map(question =>
            `<div class="ques-item">${question}</div>`
        ).join("");
        document.getElementById("question-container").innerHTML = questionHTML;

        const solutionHTML = mathData.steps.map(step =>
            `<div class="solu-item">${step}</div>`
        ).join("");
        document.getElementById("solution-container").innerHTML = solutionHTML;

        // document.getElementById("answer-container").innerHTML = `
        //     <div class="answ-item">${mathData.answer}</div>
        // `;
        const answerHTML = mathData.answer.map(answer =>
            `<div class="answ-item">${answer}</div>`
        ).join("")
        document.getElementById("answer-container").innerHTML = answerHTML;

        // Render ulang KaTeX jika isi dimasukkan setelah halaman siap
        window.addEventListener('load', () => {
            if (typeof renderMathInElement === 'function') {
                renderMathInElement(document.body, {
                    delimiters: [
                        {left: '$$', right: '$$', display: true},
                        {left: '\\(', right: '\\)', display: false}
                    ]
                });
            }
        });