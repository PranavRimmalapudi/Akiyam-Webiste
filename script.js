/*
  AIKYAM Website — Minimal Script for Core Team & Events
  - Simple, direct data loading
  - No complex initialization
*/

console.log('AIKYAM: Script loaded!');

/* ===================== HEADER LOADING ==================== */
async function loadHeader() {
  try {
    const headerPlaceholder = document.getElementById('header-placeholder');
    if (!headerPlaceholder) {
      console.log('AIKYAM: Header placeholder not found');
      return;
    }
    
    console.log('AIKYAM: Fetching header...');
    const response = await fetch('./common/header.html');
    if (!response.ok) {
      console.error('AIKYAM: Failed to fetch header:', response.status);
      return;
    }
    
    const headerHTML = await response.text();
    console.log('AIKYAM: Header HTML loaded, length:', headerHTML.length);
    headerPlaceholder.innerHTML = headerHTML;
    
    // Reinitialize mobile navigation after header is loaded
    initMobileNav();
    console.log('AIKYAM: Header loaded successfully');
  } catch (error) {
    console.error('AIKYAM: Error loading header:', error);
  }
}

/* ===================== THEME INITIALIZATION ==================== */
(function initTheme() {
  const saved = localStorage.getItem('AIKYAM_theme') || 'dark';
  if (saved === 'light') document.body.classList.add('light');
})();

/* ================== SCROLL PROGRESS & BACK-TO-TOP ================== */
function initScrollProgress() {
  const btn = document.getElementById('toTop');
  const prog = document.getElementById('scroll-progress');
  if (!btn || !prog) return;
  
  function onScroll() {
    const y = window.scrollY;
    const h = document.documentElement.scrollHeight - window.innerHeight;
    const pct = Math.max(0, Math.min(1, y / h));
    prog.style.width = (pct * 100) + '%';
    if (y > 280) btn.classList.add('show'); 
    else btn.classList.remove('show');
  }
  
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ====================== BUTTON RIPPLE EFFECT ======================= */
function initButtonRipple() {
  document.addEventListener('click', (e) => {
    const b = e.target.closest('.btn');
    if (!b) return;
    const r = document.createElement('span');
    r.className = 'r';
    const rect = b.getBoundingClientRect();
    r.style.left = (e.clientX - rect.left) + 'px';
    r.style.top = (e.clientY - rect.top) + 'px';
    b.appendChild(r);
    setTimeout(() => r.remove(), 620);
  });
}

/* =================== BACKGROUND ZOOM ON SCROLL ===================== */
function initBackgroundZoom() {
  const img = document.getElementById('bgZoomImg');
  if (!img) return;
  
  function onScroll() {
    const doc = document.documentElement;
    const max = Math.max(1, doc.scrollHeight - window.innerHeight);
    const p = window.scrollY / max;
    const scale = 1 + p * 0.8;
    img.style.transform = `scale(${scale})`;
  }
  
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ======================= REVEAL ON INTERSECT ======================= */
function initRevealOnScroll() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('show');
    });
  }, { threshold: 0.22 });
  
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
}

// Theme toggle
function initThemeToggle() {
  const themeToggle = document.getElementById('themeToggle');
  if (!themeToggle) return;
  
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light');
    localStorage.setItem('AIKYAM_theme', document.body.classList.contains('light') ? 'light' : 'dark');
  });
}

// Mobile navigation
function initMobileNav() {
  const header = document.getElementById('siteHeader');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.querySelector('.nav-links');
  
  if (!navToggle || !navLinks || !header) return;
  
  const closeMenu = () => { 
    header.classList.remove('open'); 
    navToggle.setAttribute('aria-expanded', 'false'); 
  };
  
  const toggleMenu = () => {
    const open = header.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  };

  navToggle.addEventListener('click', toggleMenu);
  navLinks.addEventListener('click', (e) => {
    if (e.target.closest('a')) closeMenu();
  });
  
  document.addEventListener('click', (e) => {
    if (!header.classList.contains('open')) return;
    if (!header.contains(e.target)) closeMenu();
  });
  
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) closeMenu();
  });
}

// Global vendors storage for filtering
let globalVendors = [];

// Simple data loading and rendering
async function loadData() {
  console.log('AIKYAM: Loading data...');
  
  try {
    // Load core team
    console.log('AIKYAM: Fetching core team...');
    const coreResponse = await fetch('./data/coreTeam.json');
    console.log('AIKYAM: Core response status:', coreResponse.status);
    const coreTeam = await coreResponse.json();
    console.log('AIKYAM: Core team data:', coreTeam);
    
    // Render core team
    const coreContainer = document.getElementById('coreCards');
    if (coreContainer && Array.isArray(coreTeam)) {
      coreContainer.innerHTML = '';
      coreTeam.forEach(member => {
        const card = document.createElement('div');
        card.className = 'person-card';
        card.innerHTML = `
          <img src="${member.img}" alt="${member.name}" width="180" height="180" loading="lazy">
          <div class="name">${member.name}</div>
          <div class="role">${member.role}</div>
        `;
        
        // Add themed fallback for missing images
        const img = card.querySelector('img');
        if (img) {
          img.addEventListener('error', () => {
            const initials = member.name.split(' ').map(word => word[0]).join('').slice(0, 2);
            const placeholder = document.createElement('div');
            placeholder.style.cssText = `
              width: 180px;
              height: 180px;
              background: linear-gradient(135deg, #ffcc00, #ff9900);
              display: flex;
              align-items: center;
              justify-content: center;
              border-radius: 50%;
              color: #000;
              font-weight: bold;
              font-size: 36px;
              text-align: center;
              margin: 0 auto 16px auto;
              box-shadow: 0 8px 24px rgba(255, 204, 0, 0.3);
            `;
            placeholder.textContent = initials;
            img.replaceWith(placeholder);
          }, { once: true });
        }
        
        coreContainer.appendChild(card);
      });
      console.log('✅ AIKYAM: Core team rendered -', coreTeam.length, 'members');
    }
    
    // Load events
    console.log('AIKYAM: Fetching events...');
    const upcomingResponse = await fetch('./data/upcomingEvents.json');
    const upcomingEvents = await upcomingResponse.json();
    const completedResponse = await fetch('./data/completedEvents.json');
    const completedEvents = await completedResponse.json();
    console.log('AIKYAM: Events loaded - upcoming:', upcomingEvents.length, 'completed:', completedEvents.length);
    
    // Render past events
    const pastContainer = document.getElementById('pastVLoop');
    if (pastContainer && Array.isArray(completedEvents)) {
      pastContainer.innerHTML = '';
      const wrapper = document.createElement('div');
      wrapper.className = 'vtrack';
      
      completedEvents.forEach(event => {
        const card = document.createElement('div');
        card.className = 'event-card';
        card.innerHTML = `
          <div class="event-image">
            <img src="${event.img}" alt="${event.title}" loading="lazy" style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px;">
          </div>
          <div class="event-title">${event.title}</div>
          <div class="event-meta">
            <span class="pill">Completed</span>
            <span>${new Date(event.date).toLocaleDateString()}</span>
          </div>
          <div class="event-desc">${event.summary}</div>
        `;
        
        // Add fallback handling for event images
        const img = card.querySelector('img');
        if (img) {
          let fallbackTried = false;
          img.addEventListener('error', () => {
            if (!fallbackTried && event.fallback) {
              fallbackTried = true;
              img.src = event.fallback;
            } else {
              // Create themed placeholder
              const initials = event.title.split(' ').map(word => word[0]).join('').slice(0, 2);
              const placeholder = document.createElement('div');
              placeholder.style.cssText = `
                width: 100%;
                height: 200px;
                background: linear-gradient(135deg, #ffcc00, #ff9900);
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 8px;
                color: #000;
                font-weight: bold;
                font-size: 24px;
                text-align: center;
                box-shadow: 0 4px 12px rgba(255, 204, 0, 0.3);
              `;
              placeholder.textContent = initials;
              img.replaceWith(placeholder);
            }
          }, { once: false });
        }
        
        wrapper.appendChild(card);
      });
      pastContainer.appendChild(wrapper);
      console.log('✅ AIKYAM: Past events rendered -', completedEvents.length, 'events');
    }
    
    // Render upcoming events
    const upcomingContainer = document.getElementById('upVLoop');
    if (upcomingContainer && Array.isArray(upcomingEvents)) {
      upcomingContainer.innerHTML = '';
      const wrapper = document.createElement('div');
      wrapper.className = 'vtrack';
      
      upcomingEvents.forEach(event => {
        const card = document.createElement('div');
        card.className = 'event-card';
        const when = event.tbd ? 'Date TBD' : new Date(event.start).toLocaleString([], { 
          month: 'short', 
          day: 'numeric', 
          hour: '2-digit', 
          minute: '2-digit' 
        });
        
        card.innerHTML = `
          <div class="event-image">
            <img src="${event.img}" alt="${event.title}" loading="lazy" style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px;">
          </div>
          <div class="event-title">${event.title}</div>
          <div class="event-meta">
            <span class="pill">${event.tbd ? 'TBD' : 'Upcoming'}</span>
            <span>${event.tbd ? 'To be announced' : when}</span>
          </div>
          <div class="event-desc">${event.location || 'TBD'} • ${event.price > 0 ? '$' + event.price : 'Free'}</div>
          <div class="event-actions" style="margin-top: 12px; display: flex; gap: 8px; flex-wrap: wrap;">
            ${event.tbd ? '' : `<button class="btn mini secondary add-to-cal-btn" data-event-id="${event.id}">📅 Add to Calendar</button>`}
            ${event.tbd ? '' : `<a class="btn mini outline" href="#register">Register</a>`}
          </div>
        `;
        
        // Add fallback handling for event images
        const img = card.querySelector('img');
        if (img) {
          let fallbackTried = false;
          img.addEventListener('error', () => {
            if (!fallbackTried && event.fallback) {
              fallbackTried = true;
              img.src = event.fallback;
            } else {
              // Create themed placeholder
              const initials = event.title.split(' ').map(word => word[0]).join('').slice(0, 2);
              const placeholder = document.createElement('div');
              placeholder.style.cssText = `
                width: 100%;
                height: 200px;
                background: linear-gradient(135deg, #ffcc00, #ff9900);
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 8px;
                color: #000;
                font-weight: bold;
                font-size: 24px;
                text-align: center;
                box-shadow: 0 4px 12px rgba(255, 204, 0, 0.3);
              `;
              placeholder.textContent = initials;
              img.replaceWith(placeholder);
            }
          }, { once: false });
        }
        
        // Add click handler for "Add to Calendar" button
        if (!event.tbd) {
          const addCalBtn = card.querySelector('.add-to-cal-btn');
          if (addCalBtn) {
            addCalBtn.addEventListener('click', (e) => {
              e.preventDefault();
              showAddToCalendarOptions(event);
            });
          }
        }
        
        wrapper.appendChild(card);
      });
      upcomingContainer.appendChild(wrapper);
      console.log('✅ AIKYAM: Upcoming events rendered -', upcomingEvents.length, 'events');
    }
    
    // Load and render board members
    console.log('AIKYAM: Fetching board members...');
    const boardResponse = await fetch('./data/boardMembers.json');
    const boardData = await boardResponse.json();
    console.log('AIKYAM: Board data:', boardData);
    
    // Render chairman separately
    const chairmanContainer = document.getElementById('chairmanCard');
    if (chairmanContainer && boardData.chairman) {
      chairmanContainer.innerHTML = '';
      const member = boardData.chairman;
      const card = document.createElement('div');
      card.className = 'person-card';
      card.innerHTML = `
        <img src="${member.img}" alt="${member.name}" width="180" height="180" loading="lazy">
        <div class="name">${member.name}</div>
        <div class="role">${member.role}</div>
      `;
      
      // Add themed fallback for missing images
      const img = card.querySelector('img');
      if (img) {
        img.addEventListener('error', () => {
          const initials = member.name.split(' ').map(word => word[0]).join('').slice(0, 2);
          const placeholder = document.createElement('div');
          placeholder.style.cssText = `
            width: 180px;
            height: 180px;
            background: linear-gradient(135deg, #ffcc00, #ff9900);
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            color: #000;
            font-weight: bold;
            font-size: 36px;
            text-align: center;
            margin: 0 auto 16px auto;
            box-shadow: 0 8px 24px rgba(255, 204, 0, 0.3);
          `;
          placeholder.textContent = initials;
          img.replaceWith(placeholder);
        }, { once: true });
      }
      
      chairmanContainer.appendChild(card);
      console.log('✅ AIKYAM: Chairman rendered');
    }
    
    // Render other board members
    const boardContainer = document.getElementById('boardCards');
    if (boardContainer && Array.isArray(boardData.members)) {
      boardContainer.innerHTML = '';
      boardData.members.forEach(member => {
        const card = document.createElement('div');
        card.className = 'person-card';
        card.innerHTML = `
          <img src="${member.img}" alt="${member.name}" width="180" height="180" loading="lazy">
          <div class="name">${member.name}</div>
          <div class="role">${member.role}</div>
        `;
        
        // Add themed fallback for missing images
        const img = card.querySelector('img');
        if (img) {
          img.addEventListener('error', () => {
            const initials = member.name.split(' ').map(word => word[0]).join('').slice(0, 2);
            const placeholder = document.createElement('div');
            placeholder.style.cssText = `
              width: 180px;
              height: 180px;
              background: linear-gradient(135deg, #ffcc00, #ff9900);
              display: flex;
              align-items: center;
              justify-content: center;
              border-radius: 50%;
              color: #000;
              font-weight: bold;
              font-size: 36px;
              text-align: center;
              margin: 0 auto 16px auto;
              box-shadow: 0 8px 24px rgba(255, 204, 0, 0.3);
            `;
            placeholder.textContent = initials;
            img.replaceWith(placeholder);
          }, { once: true });
        }
        
        boardContainer.appendChild(card);
      });
      console.log('✅ AIKYAM: Board members rendered -', boardData.members.length, 'members');
    }
    
    // Render calendar
    console.log('AIKYAM: Rendering calendar...');
    renderCalendar(upcomingEvents);
    
    // Load and render vendors
    console.log('AIKYAM: Fetching vendors...');
    const vendorsResponse = await fetch('./data/vendors.json');
    globalVendors = await vendorsResponse.json();
    console.log('AIKYAM: Vendors data:', globalVendors);
    
    // Render vendor grid
    renderVendors(globalVendors, 'All');
    
    // Render vendor marquee
    renderVendorMarquee(globalVendors);
    
    // Setup vendor filtering
    setupVendorFilters();
    
    // Start countdown for next event
    console.log('AIKYAM: Starting countdown...');
    startCountdown(upcomingEvents);
    
    console.log('🎉 AIKYAM: All data loaded successfully!');
    
  } catch (error) {
    console.error('❌ AIKYAM: Error loading data:', error);
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', async function() {
  console.log('AIKYAM: DOM ready, starting initialization...');
  
  // Load header first
  await loadHeader();
  
  // Initialize all UI components
  initScrollProgress();
  initButtonRipple();
  initBackgroundZoom();
  initRevealOnScroll();
  initGalleryMarquee();
  initHeroParallax();
  initSunburst();
  initThemeToggle();
  // Note: initMobileNav is called after header loads, not here
  initVendorFilters();
  console.log('AIKYAM: All UI components initialized');
  
  // Load data
  loadData();
});

/* ===================== HERO PARALLAX MICRO-SWAY ==================== */
function initHeroParallax() {
  const wrap = document.getElementById('heroWrap');
  const logo = document.getElementById('heroLogo');
  if (!wrap || !logo) return;
  
  let RAF = null;
  function onMove(e) {
    const r = wrap.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    if (RAF) cancelAnimationFrame(RAF);
    RAF = requestAnimationFrame(() => {
      logo.style.transform = `translate(${x * 14}px, ${y * 14}px)`;
    });
  }
  wrap.addEventListener('pointermove', onMove);
}

/* ===================== SUNBURST ANIMATION ==================== */
function initSunburst() {
  const sweep = document.querySelector('.sunburst .sweep');
  if (sweep) {
    sweep.style.setProperty('--beamspd', (8 + Math.random() * 6) + 's');
  }
}

/* ===================== CALENDAR RENDERING ==================== */
function renderCalendar(upcomingEvents) {
  const grid = document.getElementById('calendarGrid');
  const monthLbl = document.getElementById('calendarMonth');
  const schedHost = document.getElementById('upcomingSchedule');
  
  if (!grid || !monthLbl) return;
  
  const now = new Date();
  const focus = new Date(now.getFullYear(), now.getMonth(), 1);
  monthLbl.textContent = focus.toLocaleString(undefined, { month: 'long', year: 'numeric' });

  const startDow = (focus.getDay() + 7) % 7;
  const daysInMonth = new Date(focus.getFullYear(), focus.getMonth() + 1, 0).getDate();
  const totalCells = Math.ceil((startDow + daysInMonth) / 7) * 7;
  
  // Create event date map
  const eventMap = {};
  if (Array.isArray(upcomingEvents)) {
    upcomingEvents.forEach(ev => {
      if (!ev.tbd && ev.start) {
        const d = new Date(ev.start);
        const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
        eventMap[key] = (eventMap[key] || 0) + 1;
      }
    });
  }

  grid.innerHTML = '';
  for (let i = 0; i < totalCells; i++) {
    const cell = document.createElement('div');
    cell.className = 'cal-cell';
    const dayNum = i - startDow + 1;
    const inMonth = dayNum >= 1 && dayNum <= daysInMonth;
    if (!inMonth) {
      cell.classList.add('mute');
      cell.textContent = '';
    } else {
      cell.textContent = dayNum;
      const d = new Date(focus.getFullYear(), focus.getMonth(), dayNum);
      if (eventMap[`${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`]) {
        cell.classList.add('has');
      }
      if (sameDate(d, now)) {
        cell.style.outline = '2px solid rgba(255,204,0,.7)';
      }
    }
    grid.appendChild(cell);
  }
  
  // Render upcoming schedule
  if (schedHost && Array.isArray(upcomingEvents)) {
    const soon = upcomingEvents.slice().sort((a, b) => {
      const A = a.tbd ? Infinity : new Date(a.start).getTime();
      const B = b.tbd ? Infinity : new Date(b.start).getTime();
      return A - B;
    });
    
    schedHost.innerHTML = '';
    soon.forEach(ev => {
      const d = ev.tbd ? null : new Date(ev.start);
      const dt = ev.tbd ? 'Date TBD' : `${d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} • ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
      
      const item = document.createElement('div');
      item.className = 'sch-item';
      item.innerHTML = `
        <div class="t">${ev.title}</div>
        <div class="d">${dt} — ${ev.location || 'TBD'} • ${ev.price > 0 ? '$' + ev.price : 'Free'}</div>
        <div class="a">
          ${ev.tbd ? '' : `<button class="btn mini secondary add-to-cal-btn" data-event-id="${ev.id}">📅 Add to Calendar</button>`}
          ${ev.tbd ? '' : `<a class="btn mini outline" href="#register">Register</a>`}
        </div>
      `;
      
      // Add click handler for "Add to Calendar" button
      if (!ev.tbd) {
        const addCalBtn = item.querySelector('.add-to-cal-btn');
        if (addCalBtn) {
          addCalBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showAddToCalendarOptions(ev);
          });
        }
      }
      
      schedHost.appendChild(item);
    });
  }
  
  console.log('✅ AIKYAM: Calendar rendered');
}

// Add to Calendar functionality
function showAddToCalendarOptions(event) {
  // Create modal/dropdown for calendar options
  const modal = document.createElement('div');
  modal.className = 'add-to-cal-modal';
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
  `;
  
  const content = document.createElement('div');
  content.style.cssText = `
    background: var(--bg);
    border: 1px solid var(--brd);
    border-radius: 12px;
    padding: 24px;
    max-width: 400px;
    width: 90%;
    box-shadow: var(--shadow);
  `;
  
  // Format event details for calendar
  const startDate = new Date(event.start);
  const endDate = event.end ? new Date(event.end) : new Date(startDate.getTime() + 2 * 60 * 60 * 1000); // Default 2 hours if no end time
  
  const formatDate = (date) => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };
  
  const eventTitle = encodeURIComponent(event.title);
  const eventDesc = encodeURIComponent(event.desc || 'AIKYAM Community Event');
  const eventLocation = encodeURIComponent(event.location || '');
  const startFormatted = formatDate(startDate);
  const endFormatted = formatDate(endDate);
  
  // Generate calendar URLs
  const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${eventTitle}&dates=${startFormatted}/${endFormatted}&details=${eventDesc}&location=${eventLocation}`;
  const outlookUrl = `https://outlook.live.com/calendar/0/deeplink/compose?subject=${eventTitle}&startdt=${startDate.toISOString()}&enddt=${endDate.toISOString()}&body=${eventDesc}&location=${eventLocation}`;
  const yahooUrl = `https://calendar.yahoo.com/?v=60&view=d&type=20&title=${eventTitle}&st=${startFormatted}&dur=0200&desc=${eventDesc}&in_loc=${eventLocation}`;
  
  content.innerHTML = `
    <h3 style="margin: 0 0 16px 0; color: var(--fg);">Add "${event.title}" to Calendar</h3>
    <div style="display: flex; flex-direction: column; gap: 12px;">
      <a href="${googleUrl}" target="_blank" class="cal-option" style="
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px;
        background: var(--card);
        border-radius: 8px;
        text-decoration: none;
        color: var(--fg);
        border: 1px solid var(--brd);
        transition: all 0.2s ease;
      ">
        <span style="font-size: 20px;">📧</span>
        <span>Google Calendar</span>
      </a>
      <a href="${outlookUrl}" target="_blank" class="cal-option" style="
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px;
        background: var(--card);
        border-radius: 8px;
        text-decoration: none;
        color: var(--fg);
        border: 1px solid var(--brd);
        transition: all 0.2s ease;
      ">
        <span style="font-size: 20px;">🏢</span>
        <span>Outlook Calendar</span>
      </a>
      <a href="${yahooUrl}" target="_blank" class="cal-option" style="
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px;
        background: var(--card);
        border-radius: 8px;
        text-decoration: none;
        color: var(--fg);
        border: 1px solid var(--brd);
        transition: all 0.2s ease;
      ">
        <span style="font-size: 20px;">🟡</span>
        <span>Yahoo Calendar</span>
      </a>
      <button class="close-modal" style="
        margin-top: 8px;
        padding: 8px 16px;
        background: transparent;
        border: 1px solid var(--brd);
        border-radius: 6px;
        color: var(--muted);
        cursor: pointer;
      ">Close</button>
    </div>
  `;
  
  // Add hover effects
  const options = content.querySelectorAll('.cal-option');
  options.forEach(option => {
    option.addEventListener('mouseenter', () => {
      option.style.background = 'var(--accent)';
      option.style.color = '#000';
    });
    option.addEventListener('mouseleave', () => {
      option.style.background = 'var(--card)';
      option.style.color = 'var(--fg)';
    });
  });
  
  // Close modal functionality
  const closeModal = () => document.body.removeChild(modal);
  content.querySelector('.close-modal').addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  
  modal.appendChild(content);
  document.body.appendChild(modal);
}

/** Date-only equality check. */
function sameDate(a, b) {
  return a.getFullYear() === b.getFullYear() && 
         a.getMonth() === b.getMonth() && 
         a.getDate() === b.getDate();
}

/* ===================== COUNTDOWN TO NEXT EVENT ==================== */
function startCountdown(upcomingEvents) {
  const titleEl = document.getElementById('nextEventTitle');
  const countdownEl = document.getElementById('countdown');
  
  if (!titleEl || !countdownEl || !Array.isArray(upcomingEvents)) return;
  
  // Find next upcoming event (not TBD)
  const target = upcomingEvents
    .filter(e => !e.tbd && e.start && new Date(e.start).getTime() > Date.now())
    .sort((a, b) => new Date(a.start) - new Date(b.start))[0];
  
  if (!target) {
    titleEl.textContent = 'Stay tuned';
    countdownEl.innerHTML = '';
    return;
  }
  
  titleEl.textContent = `${target.title} — ${new Date(target.start).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`;
  
  function tick() {
    const now = Date.now();
    const targetTime = new Date(target.start).getTime();
    const timeLeft = targetTime - now;
    
    if (timeLeft <= 0) {
      countdownEl.innerHTML = '<div class=\"k\">Happening now</div>';
      return;
    }
    
    const days = Math.floor(timeLeft / 86400000);
    const hours = Math.floor((timeLeft % 86400000) / 3600000);
    const minutes = Math.floor((timeLeft % 3600000) / 60000);
    const seconds = Math.floor((timeLeft % 60000) / 1000);
    
    countdownEl.innerHTML = `
      <div class=\"k\">${days}<br/><small>days</small></div>
      <div class=\"k\">${hours}<br/><small>hrs</small></div>
      <div class=\"k\">${minutes}<br/><small>min</small></div>
      <div class=\"k\">${seconds}<br/><small>sec</small></div>
    `;
  }
  
  tick();
  // Clear any existing interval and start new one
  if (startCountdown._interval) clearInterval(startCountdown._interval);
  startCountdown._interval = setInterval(tick, 1000);
  
  console.log('✅ AIKYAM: Countdown started for', target.title);
}

/* ===================== GALLERY MARQUEE ==================== */
function initGalleryMarquee() {
  const images = [
    { src: 'assets/gallery/Gallery1.jpg', label: 'Moment 1', fallback: 'https://images.unsplash.com/photo-1548020356-5a6d8924b7f8?q=80&w=1200&auto=format&fit=crop' },
    { src: 'assets/gallery/Gallery2.jpg', label: 'Moment 2', fallback: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1200&auto=format&fit=crop' },
    { src: 'assets/gallery/Gallery3.jpg', label: 'Moment 3', fallback: 'https://images.unsplash.com/photo-1520975922284-5fbc8da7e2f3?q=80&w=1200&auto=format&fit=crop' },
    { src: 'assets/gallery/Gallery4.jpg', label: 'Moment 4', fallback: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=1200&auto=format&fit=crop' },
  ];
  
  const track = document.getElementById('gtrack');
  if (!track) return;
  
  function makeSlide(it) {
    const s = document.createElement('div');
    s.className = 'gslide';
    const im = document.createElement('img');
    im.src = it.src;
    im.alt = it.label;
    im.loading = 'lazy';
    im.decoding = 'async';
    im.onerror = () => { 
      if (it.fallback && im.src !== it.fallback) im.src = it.fallback; 
    };
    im.width = 440;
    im.height = 268;
    const lb = document.createElement('div');
    lb.className = 'label';
    lb.textContent = it.label;
    s.appendChild(im);
    s.appendChild(lb);
    return s;
  }
  
  // Add images twice for continuous loop
  [...images, ...images].forEach(it => track.appendChild(makeSlide(it)));
  
  let x = 0;
  const speed = 0.35;
  function loop() {
    x -= speed;
    const halfWidth = track.scrollWidth / 2;
    if (Math.abs(x) >= halfWidth) { x = 0; }
    track.style.transform = `translateX(${x}px)`;
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
  
  console.log('✅ AIKYAM: Gallery marquee initialized');
}

/* ===================== VENDORS FUNCTIONALITY ==================== */

// Setup vendor filter button functionality
function setupVendorFilters() {
  const filterButtons = document.querySelectorAll('#vendorSection .filter-button');
  
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from all buttons
      filterButtons.forEach(btn => btn.classList.remove('active'));
      // Add active class to clicked button
      button.classList.add('active');
      
      // Get the filter category from the button text
      const filterCategory = button.textContent.trim();
      
      // Render vendors with filter
      renderVendors(globalVendors, filterCategory);
      
      console.log('AIKYAM: Filtering vendors by:', filterCategory);
    });
  });
}

function makeVendorCard(vendor) {
  const div = document.createElement('div');
  div.className = 'vendor-card';
  
  // Category colors for placeholder backgrounds
  const categoryColors = {
    'Services': '#4CAF50',
    'Food': '#FF9800', 
    'Education': '#2196F3',
    'Boutique': '#9C27B0',
    'default': '#607D8B'
  };
  
  const bgColor = categoryColors[vendor.cat] || categoryColors.default;
  
  div.innerHTML = `
    <a href="${vendor.url}" target="_blank" rel="noopener" style="text-decoration:none;color:inherit;">
      <div class="vendor-logo-placeholder" style="
        width: 100%;
        height: 120px;
        background: ${bgColor};
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 8px;
        margin-bottom: 12px;
        color: white;
        font-weight: bold;
        font-size: 18px;
        text-align: center;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      ">
        ${vendor.name.split(' ').map(word => word[0]).join('').slice(0, 3)}
      </div>
      <div class="name">${vendor.name}</div>
      <div class="cat pill">${vendor.cat}</div>
      <div class="hint" style="margin-top:6px;">${vendor.blurb}</div>
    </a>
  `;
  
  return div;
}

function renderVendors(vendors, filter = 'All') {
  const grid = document.getElementById('vendorGrid');
  if (!grid || !Array.isArray(vendors)) return;
  
  grid.innerHTML = '';
  const filteredVendors = vendors.filter(v => filter === 'All' || v.cat === filter);
  
  if (filteredVendors.length === 0) {
    grid.innerHTML = '<div class="hint">No vendors found for this category.</div>';
    return;
  }
  
  filteredVendors.forEach(vendor => grid.appendChild(makeVendorCard(vendor)));
  console.log('✅ AIKYAM: Vendors rendered -', filteredVendors.length, 'vendors');
}

function renderVendorMarquee(vendors) {
  const track = document.getElementById('vendorMarquee');
  if (!track || !Array.isArray(vendors)) return;
  
  function makeLogo(vendor) {
    const s = document.createElement('div');
    s.className = 'gslide';
    s.style.width = '280px';
    s.style.height = '120px';
    
    // Category colors for placeholder backgrounds
    const categoryColors = {
      'Services': '#4CAF50',
      'Food': '#FF9800', 
      'Education': '#2196F3',
      'Boutique': '#9C27B0',
      'default': '#607D8B'
    };
    
    const bgColor = categoryColors[vendor.cat] || categoryColors.default;
    
    const placeholder = document.createElement('div');
    placeholder.style.cssText = `
      width: 100%;
      height: 100px;
      background: ${bgColor};
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      color: white;
      font-weight: bold;
      font-size: 16px;
      text-align: center;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    `;
    placeholder.textContent = vendor.name.split(' ').map(word => word[0]).join('').slice(0, 3);
    
    const lb = document.createElement('div');
    lb.className = 'label';
    lb.textContent = vendor.name;
    
    s.appendChild(placeholder);
    s.appendChild(lb);
    return s;
  }
  
  // Add vendors twice for continuous loop
  [...vendors, ...vendors].forEach(vendor => track.appendChild(makeLogo(vendor)));
  
  let x = 0;
  const speed = 0.5;
  function loop() {
    x -= speed;
    const halfWidth = track.scrollWidth / 2;
    if (Math.abs(x) >= halfWidth) { x = 0; }
    track.style.transform = `translateX(${x}px)`;
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
  
  console.log('✅ AIKYAM: Vendor marquee initialized');
}

function initVendorFilters() {
  // This will be called after vendors are loaded
  // Filter buttons are handled by event delegation in the vendors section
}

// Global vendor filter handling
function handleVendorFilter(filter, vendors) {
  renderVendors(vendors, filter);
  // Show toast message
  const message = filter === 'All' ? 'Showing all vendors' : 'Filtered: ' + filter;
  console.log('AIKYAM:', message);
}

console.log('AIKYAM: Script setup complete, waiting for DOM...');