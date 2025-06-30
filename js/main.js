// js/main.js

document.addEventListener('DOMContentLoaded', () => {
  // § Intro & Hero Setup
  const intro         = document.querySelector('.intro');
  const introBtn      = intro.querySelector('.btn');
  const categoryHero  = document.querySelector('.category-hero');
  const categoryNav   = document.querySelector('.category-nav');
  const handlesBox    = document.getElementById('handlesBox');
  const handlesPopup  = document.getElementById('handlesPopup');

  // § 1) Randomize both backgrounds
  const heroImgs = ['hero1.jpg','hero2.jpg','hero3.jpg'];
  const pickHero = heroImgs[Math.floor(Math.random() * heroImgs.length)];
  intro.style.backgroundImage        = `url('img/hero/${pickHero}')`;
  categoryHero.style.backgroundImage = `url('img/hero/${pickHero}')`;

  // § 2) Lock scroll & hide nav on load
  document.body.classList.add('no-scroll');
  // category-nav is display:none by default (CSS)

  // § 3) Intro → reveal nav & unlock scrolling
  introBtn.addEventListener('click', e => {
    e.preventDefault();
    intro.classList.add('fade-out');
    intro.addEventListener('transitionend', () => {
      intro.remove();
      categoryNav.classList.add('show');      // show nav
      document.body.classList.remove('no-scroll');
      window.scrollTo(0, 0);
      // clear any active gallery states
      document.querySelectorAll('.gallery.section')
              .forEach(sec => sec.classList.remove('active'));
    }, { once: true });
  });

  // § 4) Only handle internal "#…" category links
  categoryNav.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const targetId = link.getAttribute('href').slice(1);
      const targetEl = document.getElementById(targetId);

      // fade out & remove the category-hero
      if (categoryHero) {
        categoryHero.classList.add('fade-out');
        categoryHero.addEventListener('transitionend', () => {
          categoryHero.remove();
        }, { once: true });
      }

      // show only the chosen gallery/section
      document.querySelectorAll('.gallery.section, .section')
              .forEach(sec => {
        sec.classList.toggle('active', sec.id === targetId);
      });

      // smooth scroll into view
      if (targetEl) targetEl.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // § 5) Handles toggle
  handlesBox.addEventListener('click', () => {
    handlesPopup.style.display =
      handlesPopup.style.display === 'block' ? 'none' : 'block';
  });

  // § ADMIN PANEL LOGIC
  const adminBtn     = document.getElementById('adminBtn');
  const adminPanel   = document.getElementById('adminPanel');
  const adminClose   = document.getElementById('adminClose');
  const categoryList = document.getElementById('categoryList');
  const addCatBtn    = document.getElementById('addCategoryBtn');
  const newCatInput  = document.getElementById('newCategoryName');
  const photoListEl  = document.getElementById('photoList');
  const photoUpload  = document.getElementById('photoUpload');
  const uploadBtn    = document.getElementById('uploadBtn');

  // § 6) Open/Close Admin Panel
  adminBtn.addEventListener('click', async () => {
    adminPanel.classList.add('show');
    await loadCategories();
    await loadPhotos();
  });
  adminClose.addEventListener('click', () => {
    adminPanel.classList.remove('show');
  });

  // § 7) Load & render categories
  async function loadCategories() {
    categoryList.innerHTML = 'Loading categories…';
    // const resp = await fetch('/api/categories');
    // const cats = await resp.json();
    const cats = [                          // stub data
      { id: 1, name: 'people' },
      { id: 2, name: 'places' },
      { id: 3, name: 'things' }
    ];
    categoryList.innerHTML = '';
    cats.forEach(c => {
      const li = document.createElement('li');
      li.dataset.id = c.id;
      li.innerHTML = `
        <span>${c.name}</span>
        <button data-id="${c.id}" class="del-cat">Delete</button>
      `;
      // delete
      li.querySelector('.del-cat').addEventListener('click', async () => {
        // await fetch(`/api/categories/${c.id}`, { method: 'DELETE' });
        li.remove();
      });
      categoryList.appendChild(li);
    });
  }

  // § 8) Add new category
  addCatBtn.addEventListener('click', async () => {
    const name = newCatInput.value.trim();
    if (!name) return alert('Enter a category name');
    // const resp = await fetch('/api/categories', { method:'POST', body: JSON.stringify({ name }) });
    // const newCat = await resp.json();
    newCatInput.value = '';
    await loadCategories();
  });

  // § 9) Load & render photos
  async function loadPhotos() {
    photoListEl.innerHTML = 'Loading photos…';
    // const resp = await fetch('/api/photos');
    // const photos = await resp.json();
    const photos = [                        // stub data
      { id: 1, url: 'img/people1.jpg', category: 'people' }
    ];
    photoListEl.innerHTML = '';
    photos.forEach(p => {
      const div = document.createElement('div');
      div.className = 'photo-item';
      div.innerHTML = `
        <img src="${p.url}" />
        <select data-id="${p.id}">
          <option value="people" ${p.category==='people'?'selected':''}>People</option>
          <option value="places" ${p.category==='places'?'selected':''}>Places</option>
          <option value="things" ${p.category==='things'?'selected':''}>Things</option>
        </select>
        <button class="del-photo" data-id="${p.id}">Delete</button>
      `;
      // move
      div.querySelector('select').addEventListener('change', async e => {
        const id = e.target.dataset.id, newCat = e.target.value;
        // await fetch(`/api/photos/${id}`, { method:'PUT', body: JSON.stringify({ category: newCat }) });
      });
      // delete
      div.querySelector('.del-photo').addEventListener('click', async e => {
        const id = e.target.dataset.id;
        // await fetch(`/api/photos/${id}`, { method:'DELETE' });
        div.remove();
      });
      photoListEl.appendChild(div);
    });
  }

  // § 10) Upload new photos
  uploadBtn.addEventListener('click', async () => {
    const files = Array.from(photoUpload.files);
    if (!files.length) return alert('Select files to upload');
    // const form = new FormData();
    // files.forEach(f => form.append('photos', f));
    // await fetch('/api/photos', { method:'POST', body: form });
    photoUpload.value = '';
    await loadPhotos();
  });
});