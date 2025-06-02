from flask import Flask, request, jsonify
from PIL import Image
from pix2tex.cli import LatexOCR
import os
import subprocess

app = Flask(__name__)
model = LatexOCR()

UPLOAD_FOLDER = 'images'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/solve-image', methods=['POST'])
def solve_image():
    if 'image' not in request.files:
        return jsonify({'error': 'No image file provided'}), 400

    # Simpan gambar
    image_file = request.files['image']
    path = os.path.join(UPLOAD_FOLDER, image_file.filename)
    image_file.save(path)

    # OCR
    img = Image.open(path)
    latex_code = model(img).strip()

    # Simpan latex ke file input solver
    with open("latex_input.txt", "w") as f:
        f.write(latex_code)

    try:
        result = subprocess.check_output(["node", "solver.js"], stderr=subprocess.STDOUT)
        output = result.decode("utf-8")
        return jsonify({
            'latex': latex_code,
            'solution_steps': output
        })
    except subprocess.CalledProcessError as e:
        return jsonify({'error': 'Failed to solve expression', 'details': e.output.decode("utf-8")}), 500


@app.route('/solve-text', methods=['POST'])
def solve_text():
    data = request.get_json()
    if not data or 'latex' not in data:
        return jsonify({'error': 'No latex expression provided'}), 400

    latex_code = data['latex']

    # Simpan latex ke file input solver
    with open("latex_input.txt", "w") as f:
        f.write(latex_code)

    try:
        result = subprocess.check_output(["node", "solver.js"], stderr=subprocess.STDOUT)
        output = result.decode("utf-8")
        return jsonify({
            'latex': latex_code,
            'solution_steps': output
        })
    except subprocess.CalledProcessError as e:
        return jsonify({'error': 'Failed to solve expression', 'details': e.output.decode("utf-8")}), 500


if __name__ == '__main__':
    app.run(port=5001, debug=True)
