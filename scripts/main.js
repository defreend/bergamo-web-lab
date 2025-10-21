(async function () {
  document.getElementById('year').textContent = new Date().getFullYear();

  const galleryEl = document.getElementById('gallery-grid');

  const lightboxEl = document.getElementById('lightbox');
  const lbImg = document.getElementById('lightbox-img');
  const lbCaption = document.getElementById('lightbox-caption');
  const btnClose = document.querySelector('.lb-close');
  const btnPrev  = document.querySelector('.lb-prev');
  const btnNext  = document.querySelector('.lb-next');

  let photosData = [];
  let currentIndex = 0;

  function show(index){
    const p = photosData[index];
    if (!p) return;
    lbImg.src = p.src;
    lbImg.alt = p.title || '';
    lbCaption.innerHTML = p.title ? `<strong>${p.title}</strong>${p.desc ? ' — ' + p.desc : ''}` : (p.desc || '');
  }

  function openLightbox(index){
    currentIndex = index;
    show(currentIndex);
    lightboxEl.classList.add('active');
    lightboxEl.setAttribute('aria-hidden','false');
    document.body.classList.add('no-scroll');
  }

  function closeLightbox(){
    lightboxEl.classList.remove('active');
    lightboxEl.setAttribute('aria-hidden','true');
    document.body.classList.remove('no-scroll');
  }

  function next(){
    currentIndex = (currentIndex + 1) % photosData.length;
    show(currentIndex);
  }

  function prev(){
    currentIndex = (currentIndex - 1 + photosData.length) % photosData.length;
    show(currentIndex);
  }


  btnClose.addEventListener('click', closeLightbox);
  btnNext .addEventListener('click', next);
  btnPrev .addEventListener('click', prev);

  lightboxEl.addEventListener('click', (e)=>{ if (e.target === lightboxEl) closeLightbox(); });

  document.addEventListener('keydown', (e)=>{
    if (!lightboxEl.classList.contains('active')) return;
    if (e.key === 'Escape')      closeLightbox();
    if (e.key === 'ArrowRight')  next();
    if (e.key === 'ArrowLeft')   prev();
  });

  try {
    const res = await fetch('data/photos.json');
    photosData = await res.json();

    photosData.forEach((p, i) => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <img class="lozad" data-src="${p.src}" alt="${p.title}" data-index="${i}">
        <div class="meta">
          <strong>${p.title}</strong><br>
          <span>${p.desc}</span>
        </div>
      `;
      galleryEl.appendChild(card);
    });


    const observer = lozad('.lozad', {
      loaded: el => {
        el.addEventListener('load', () => {
          requestAnimationFrame(() => el.classList.add('loaded'));
        });
      }
    });
    observer.observe();

    galleryEl.addEventListener('click', (e) => {
      const img = e.target.closest('img.lozad');
      if (!img) return;
      const idx = Number(img.dataset.index);
      if (!Number.isNaN(idx)) openLightbox(idx);
    });

  } catch (err) {
    console.error('Errore nel caricamento della galleria:', err);
    galleryEl.innerHTML = `<p style="color:red;">Impossibile caricare la galleria.</p>`;
  }
})();