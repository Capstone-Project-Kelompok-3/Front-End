        // ------------ //
        // Script KaTex //
        // ------------ //

        const savedQuestions = [
            {
                date: "March 28, 2025",
                soal: [
                    "Selesaikan persamaan: \\( 2x + 4 = 12 \\)",
                    "\\( x^2 - 9 = 0 \\)"
                ]
            },
            {
                date: "March 27, 2025",
                soal: [
                    "Faktorkan: \\( x^2 + 4x + 4 \\)"
                ]
            },
            {
                date: "March 28, 2025",
                soal: [
                    "Selesaikan persamaan: \\( 2x + 4 = 12 \\)",
                    "\\( x^2 - 9 = 0 \\)"
                ]
            },
            {
                date: "March 27, 2025",
                soal: [
                    "Faktorkan: \\( x^2 + 4x + 4 \\)"
                ]
            },
            {
                date: "March 28, 2025",
                soal: [
                    "Selesaikan persamaan: \\( 2x + 4 = 12 \\)",
                    "\\( x^2 - 9 = 0 \\)"
                ]
            },
            {
                date: "March 27, 2025",
                soal: [
                    "Faktorkan: \\( x^2 + 4x + 4 \\)"
                ]
            }
        ];

        const historyQuestions = [
            {
                date: "March 23, 2025",
                soal: [
                    "Tentukan hasil: \\( x^2 + 4x + 12 = 20 \\)",
                    "\\( x + 5 = 10 \\)"
                ]
            },
            {
                date: "March 22, 2025",
                soal: [
                    "Hitung: \\( x^2 - 16 = 0 \\)"
                ]
            }
        ];

        function renderQuestionList(containerId, dataArray) {
            const container = document.getElementById(containerId);
            container.innerHTML = ''; // kosongkan dulu

            dataArray.forEach(item => {
                const soalGabung = item.soal.join(" | "); // Gabung soal dalam satu baris

                let html = '';

                if (containerId === "saved-container") {
                    html = `
                        <div onclick="location.href='#'" class="saved-item">
                            <div class="date">${item.date}</div>
                            <div class="question">
                                <div class="ques" style="font-weight: bold;">Question:</div>
                                <div class="ques-text">${soalGabung}</div>
                            </div>
                        </div>
                    `;
                } else if (containerId === "history-container") {
                    html = `
                        <div onclick="location.href='#'" class="history-item">
                            <div class="date">${item.date}</div>
                            <div class="question">
                                <div class="ques" style="font-weight: bold;">Question:</div>
                                <div class="ques-text">${soalGabung}</div>
                            </div>
                        </div>
                    `;
                }

                container.innerHTML += html;
            });
        }

        // Panggil fungsi render
        renderQuestionList("saved-container", savedQuestions);
        renderQuestionList("history-container", historyQuestions);

        // Render KaTeX setelah data dimasukkan
        if (typeof renderMathInElement === 'function') {
            renderMathInElement(document.body, {
                delimiters: [
                    { left: "$$", right: "$$", display: true },
                    { left: "\\(", right: "\\)", display: false }
                ]
            });
        }