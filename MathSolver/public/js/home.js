        // ------------------ //
        // Script Upload Area //
        // ------------------ //
        const uploadArea = document.getElementById('upload-area');
        const fileInput = document.getElementById('up-soal');
        const previewImage = document.getElementById('preview-image');
        const removeButton = document.getElementById('remove-image');
        const uploadButton = document.getElementById('up-button');
        const uploadText = uploadArea.querySelector('.text-drag');
        const solveButton = document.getElementById('solve-button');

        // Tipe gambar yang diperbolehkan
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

        // Drag Foto
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });

        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('dragover');
        });

        // Drop Foto
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');

            const files = e.dataTransfer.files;
            if (files.length > 0) {
            const file = files[0];
            if (allowedTypes.includes(file.type)) {
                fileInput.files = files;

                const event = new Event('change', { bubbles: true });
                fileInput.dispatchEvent(event);
            } else {
                alert('Hanya file gambar yang diperbolehkan (jpg, png, gif, webp).');
            }
            }
        });

        // Click Button
        uploadButton.addEventListener('click', (e) => {
            e.preventDefault();
            fileInput.click();
        });

        // Click Area
        uploadArea.addEventListener('click', (e) => {
            // Cegah agar klik tombol 'remove' tidak ikut trigger
            if (e.target === fileInput || e.target === removeButton || e.target.closest('#remove-image')) return;

            e.preventDefault();
            fileInput.click();
        });

        // Saat file dipilih, tampilkan preview
        fileInput.addEventListener('change', () => {
        const file = fileInput.files[0];
            if (file && allowedTypes.includes(file.type)) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    previewImage.src = e.target.result;
                    previewImage.style.display = 'block';
                    removeButton.style.display = 'block';
                    solveButton.style.display = 'block';
                    uploadButton.style.display = 'none';
                    uploadText.style.display = 'none';

                    // Disable input file agar tidak bisa diklik ulang
                    fileInput.disabled = true;
                    };
                reader.readAsDataURL(file);
            } else if (file) {
                alert('Hanya file gambar yang diperbolehkan (jpg, png, gif, webp).');
                fileInput.value = ''; // reset jika tipe salah
            }
        });

        // Tombol silang untuk menghapus gambar
        removeButton.addEventListener('click', (e) => {
            e.preventDefault(); // jangan reload halaman
            e.stopPropagation(); // Jangan trigger klik area upload
            previewImage.src = '';
            previewImage.style.display = 'none';
            removeButton.style.display = 'none';
            solveButton.style.display = 'none';
            uploadButton.style.display = 'block';
            uploadText.style.display = 'block';
            fileInput.value = ''; // Reset input file

            // Enable input file kembali
            fileInput.disabled = false;
        });

        // ----------------------------------------- //
        // Solve - EDIT DISINI UNTUK MENGIRIM GAMBAR //
        // ----------------------------------------- //
        solveButton.addEventListener('click', function(e) {
            e.preventDefault(); // jangan reload halaman

            const file = fileInput.files[0];
            if (file) {
                // Contoh kirim ke server pakai FormData
                const formData = new FormData();
                formData.append('image', file);

                fetch('solve.php', {
                    method: 'POST',
                    body: formData
                })
                .then(res => res.json())
                .then(data => {
                    alert('Solusi diterima: ' + data.solution);
                })
                .catch(err => {
                    alert('Gagal mengirim gambar.');
                });
            }
        });

        // ------------- //
        // Script Scroll //
        // ------------- //
        function scrollToCenter() {
            const element = document.getElementById("input-group");
            const elementTop = element.getBoundingClientRect().top + window.scrollY;
            const elementHeight = element.offsetHeight;
            const windowHeight = window.innerHeight;
            const scrollTo = elementTop - (windowHeight / 2) + (elementHeight / 2);

            window.scrollTo({
            top: scrollTo,
            behavior: 'smooth'
            });
        }