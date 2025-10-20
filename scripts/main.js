(async function () {
  document.getElementById('year').textContent = new Date().getFullYear();

  const galleryEl = document.getElementById('gallery-grid');

  try {
    const res = await fetch('data/photos.json');
    const photos = await res.json();

    photos.forEach(p => {
      const card = document.createElement('div');
      card.className = 'card';

      card.innerHTML = `
        <img src="${p.src}" alt="${p.title}" loading="lazy">
        <div class="meta">
          <strong>${p.title}</strong><br>
          <span>${p.desc}</span>
        </div>
      `;

      galleryEl.appendChild(card);
    });
  } catch (err) {
    galleryEl.innerHTML = `<p style="color:red;">Impossibile caricare la galleria.</p>`;
  }
})();