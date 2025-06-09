const mathsteps = require('mathsteps');
const { create, all } = require('mathjs');
const fs = require('fs');
const path = require('path');

const math = create(all);
const baseDir = __dirname;
const inputFile = path.join(baseDir, 'latex_input.txt');

const rawInput = fs.readFileSync(inputFile, 'utf8').trim();

function convertLatexToMath(expression) { 
  expression = expression.replace(/\\frac{?(\d+)}{?(\d+)}?/g, '($1/$2)');
  expression = expression.replace(/\\frac(\d)(\d)/g, '($1/$2)');
  return expression
    .replace(/\\cdot/g, '*')                          
    .replace(/\\times/g, '*')                         
    .replace(/\\div/g, '/')                           
    .replace(/\\left/g, '')                           
    .replace(/\\right/g, '')
    .replace(/\\\(/g, '(')                            
    .replace(/\\\)/g, ')');
}

// Bersihkan $$ dan ubah ke format matematika
const cleanedInput = rawInput.replace(/\$\$/g, '').trim();
const latexExpression = convertLatexToMath(cleanedInput);

try {
  if (latexExpression.includes('=')) {
    const steps = mathsteps.solveEquation(latexExpression);

    if (steps.length === 0) {
      console.log(JSON.stringify({
          success: false,
          message: "Tidak ditemukan langkah penyelesaian.",
          steps: []
        }));
    } else {
      const hasil = steps.map((step, index) => ({
        langkah: index + 1,
        operasi: step.changeType,
        transformasi: `${step.oldEquation.ascii()} → ${step.newEquation.ascii()}`
      }));

      const hasilAkhir = steps[steps.length - 1].newEquation.ascii();

      console.log(JSON.stringify({
        success: true,
        message: "Berhasil menyelesaikan persamaan.",
        result: hasilAkhir,
        steps: hasil
      }));
    }


  } else {
    const result = math.evaluate(latexExpression);
    console.log(JSON.stringify({
      success: true,
      message: "Berhasil mengevaluasi ekspresi.",
      result: `${latexExpression} = ${result}`
    }));
  }

} catch (error) {
  console.log(JSON.stringify({
    success: false,
    message: `Gagal menyelesaikan ekspresi: ${error.message}`
  }));
  process.exit(0);
}
