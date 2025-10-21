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
        <img class="lozad" data-src="${p.src}" alt="${p.title}" loading="lazy">
        <div class="meta">
          <strong>${p.title}</strong><br>
          <span>${p.desc}</span>
        </div>
      `;

      galleryEl.appendChild(card);
    });

    const observer = lozad('.lozad', {
      loaded: el => el.classList.add('loaded')
    });
    observer.observe();

  } catch (err) {
    galleryEl.innerHTML = `<p style="color:red;">Impossibile caricare la galleria.</p>`;
  }
})();