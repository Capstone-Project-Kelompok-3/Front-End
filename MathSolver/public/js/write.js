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

        mathField.addEventListener("focus", () => {
            mathField.executeCommand("showVirtualKeyboard");
        });

        mathField.focus();

        mathField.addEventListener("keydown", function(event) {
            if (event.key === "Enter") {
                event.preventDefault();

                const allFields = container.querySelectorAll("math-field");
                const currentIndex = Array.from(allFields).indexOf(mathField);

                if (currentIndex < allFields.length - 1) {
                    allFields[currentIndex + 1].focus();
                } else {
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
            console.log("Response data:", data); // Debugging

            const outputDiv = document.getElementById("solution-output");
            outputDiv.innerHTML = "";

            // Jika ada array solutions
            if (data.solutions && Array.isArray(data.solutions)) {
                data.solutions.forEach((solution, index) => {
                    let answerText = solution.answer || "Tidak ada jawaban";
                    try {
                        const parsed = JSON.parse(solution.answer);
                        if (parsed && parsed.result) {
                            answerText = parsed.result;
                        }
                    } catch (e) {
                        console.warn("Gagal parsing jawaban:", e);
                    }

                    let steps = solution.steps || [];
                    if (typeof steps === "string") {
                        try {
                            steps = JSON.parse(steps);
                        } catch (e) {
                            console.warn("Gagal parsing steps:", e);
                            steps = [];
                        }
                    }

                    const html = `
                        <div class="solution" style="margin-bottom: 20px;">
                            <h4>Soal ${index + 1}</h4>
                            <p><strong>Jawaban:</strong> ${answerText}</p>
                            <p><strong>Langkah-langkah:</strong></p>
                            <ol>
                                ${steps.map(step => {
                                    if (typeof step === "string") {
                                        return `<li>${step}</li>`;
                                    } else if (typeof step === "object" && step !== null) {
                                        return `<li>Langkah ${step.langkah}: ${step.transformasi}<br>Operasi: ${step.operasi}</li>`;
                                    } else {
                                        return `<li>Langkah tidak dikenali</li>`;
                                    }
                                }).join("")}
                            </ol>
                        </div>
                    `;
                    outputDiv.innerHTML += html;
                });
            }
            // Jika responsenya langsung result dan steps (bukan array)
            else if (data.result || data.steps) {
                let answerText = data.result || "Tidak ada jawaban";
                let steps = data.steps || [];

                const html = `
                    <div class="solution" style="margin-bottom: 20px;">
                        <h4>Soal 1</h4>
                        <p><strong>Jawaban:</strong> ${answerText}</p>
                        <p><strong>Langkah-langkah:</strong></p>
                        <ol>
                            ${steps.map(step => {
                                if (typeof step === "string") {
                                    return `<li>${step}</li>`;
                                } else if (typeof step === "object" && step !== null) {
                                    return `<li>Langkah ${step.langkah}: ${step.transformasi}<br>Operasi: ${step.operasi}</li>`;
                                } else {
                                    return `<li>Langkah tidak dikenali</li>`;
                                }
                            }).join("")}
                        </ol>
                    </div>
                `;
                outputDiv.innerHTML = html;
            } else {
                outputDiv.innerHTML = "<p>Data solusi tidak ditemukan.</p>";
            }
        })
        .catch(error => {
            console.error("Gagal memproses soal:", error);
            const outputDiv = document.getElementById("solution-output");
            outputDiv.innerHTML = "<p>Terjadi kesalahan saat memproses soal.</p>";
        });
    });

    addMathField();
});
