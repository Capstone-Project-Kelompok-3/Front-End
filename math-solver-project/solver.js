const mathsteps = require('mathsteps');
const fs = require('fs');
const path = require('path');

const baseDir = __dirname;
const inputFile = path.join(baseDir, 'latex_input.txt');

const latexExpression = fs.readFileSync(inputFile, 'utf8').trim();

try {
  const steps = mathsteps.solveEquation(latexExpression);

  if (steps.length === 0) {
    console.log("Tidak ditemukan langkah penyelesaian.");
  } else {
    let output = '';
    steps.forEach((step, index) => {
      output += `Langkah ${index + 1}:\n`;
      output += `Operasi: ${step.changeType}\n`;
      if (step.newEquation && step.oldEquation) {
        output += `${step.oldEquation.ascii()} → ${step.newEquation.ascii()}\n`;
      }
    });
    console.log(output);
  }

} catch (error) {
  console.error(`Gagal menyelesaikan ekspresi: ${error.message}`);
  process.exit(1); // pastikan keluar dengan error supaya Flask dapat tangkap
}
