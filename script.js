document.addEventListener('DOMContentLoaded', function () {
  updateCV();
});

function updateCV() {
  document.getElementById('cv-nama').textContent = document.getElementById('nama').value || 'Nama Kamu';
  document.getElementById('cv-jabatan').textContent = document.getElementById('jabatan').value || 'Jabatan Kamu';
  document.getElementById('cv-email').textContent = document.getElementById('email').value || 'email@kamu.com';
  document.getElementById('cv-telp').textContent = document.getElementById('telp').value || '08xx-xxxx-xxxx';
  document.getElementById('cv-profil').textContent = document.getElementById('profil').value || 'Belum ada profil...';
  document.getElementById('cv-pendidikan').textContent = document.getElementById('pendidikan').value || 'Belum diisi...';
  document.getElementById('cv-pengalaman').textContent = document.getElementById('pengalaman').value || 'Belum diisi...';
  document.getElementById('cv-keahlian').textContent = document.getElementById('keahlian').value || 'Belum diisi...';

  const nama = document.getElementById('nama').value || 'SA';
  const inisial = nama
    .replace(/[^a-zA-Z ]/g, '')
    .split(' ')
    .filter(k => k)
    .map(kata => kata[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'SA';
  document.getElementById('inial').textContent = inisial;
}

function updateFoto() {
  const input = document.getElementById('foto');
  const img = document.getElementById('tampil-foto');
  const inisial = document.getElementById('inial');
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = function (e) {
      img.src = e.target.result;
      img.style.display = 'block';
      inisial.style.display = 'none';
    };
    reader.readAsDataURL(input.files[0]);
  }
}

function gantiWarna(warna, tombol) {
  document.getElementById('garis-pemisah').style.backgroundColor = warna;
  document.getElementById('cv-nama').style.color = warna;
  document.querySelector('.foto-profil').style.backgroundColor = warna;
  document.querySelectorAll('.cv-konten h3').forEach(el => (el.style.color = warna));
  document.querySelectorAll('.warna-pilihan .warna').forEach(btn => btn.classList.remove('aktif'));
  tombol.classList.add('aktif');
}

function gantiLatar(warna, tombol) {
  document.getElementById('cv-preview').style.backgroundColor = warna;
  document.querySelectorAll('.warna-latar .warna').forEach(btn => btn.classList.remove('aktif'));
  tombol.classList.add('aktif');
}

async function unduhPDF() {
  const tombol = document.getElementById('tombol-unduh');
  tombol.disabled = true;
  tombol.textContent = '⏳ Sedang diproses...';

  try {
    if (typeof html2pdf === 'undefined') {
      throw new Error('Library html2pdf belum termuat. Cek koneksi internet.');
    }

    // Penting: reset scroll supaya hasil tangkapan tidak bergeser/kosong
    window.scrollTo(0, 0);

    const elemen = document.getElementById('cv-preview');
    const namaAsli = document.getElementById('nama').value.trim() || 'CV-Kamu';
    const namaFile =
      (namaAsli.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9_-]/g, '') || 'CV-Kamu') + '.pdf';

    const opsi = {
      margin: 10,
      image: { type: 'jpeg', quality: 0.95 },
      html2canvas: { scale: 2, useCORS: true, scrollX: 0, scrollY: 0, logging: false },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait', compress: true },
      pagebreak: { mode: ['css', 'legacy'] }
    };

    const blob = await html2pdf().set(opsi).from(elemen).outputPdf('blob');
    if (!blob || blob.size < 1000) throw new Error('PDF kosong');

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = namaFile;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  } catch (err) {
    console.error('Error PDF:', err);
    alert('Gagal membuat PDF: ' + err.message);
  } finally {
    tombol.disabled = false;
    tombol.textContent = '📄 Unduh CV ke PDF';
  }
}