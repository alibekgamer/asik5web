document.addEventListener('DOMContentLoaded', function () {
  const $ = selector => document.querySelector(selector);
  const $$ = selector => Array.from(document.querySelectorAll(selector));
  const settings = { dark: false, sound: true, rating: 0,
    playSound() {
      if (!this.sound) return;
      try {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextClass) return;
        const context = new AudioContextClass();
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        oscillator.type = 'sine'; oscillator.frequency.value = 580;
        gain.gain.setValueAtTime(0.035, context.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.13);
        oscillator.connect(gain); gain.connect(context.destination);
        oscillator.start(); oscillator.stop(context.currentTime + 0.13);
        oscillator.onended = () => context.close();
      } catch (error) { console.debug('Audio is unavailable:', error); }
    }
  };
  function updateTheme() {
    document.body.classList.toggle('a5-dark', settings.dark);
    const button = $('#themeToggle');
    if (button) button.textContent = settings.dark ? '☀️ Day mode' : '🌙 Night mode';
  }
  $('#themeToggle')?.addEventListener('click', () => { settings.dark = !settings.dark; updateTheme(); settings.playSound(); });
  $('#soundToggle')?.addEventListener('click', () => {
    settings.sound = !settings.sound;
    $('#soundToggle').textContent = settings.sound ? '🔊 Sound on' : '🔇 Sound off';
    $('#soundToggle').setAttribute('aria-pressed', String(settings.sound));
    settings.playSound();
  });
  const navLinks = $$('.navbar-nav .nav-link');
  document.addEventListener('keydown', event => {
    const element = document.activeElement;
    const typing = element && ['INPUT','TEXTAREA','SELECT'].includes(element.tagName);
    if (!typing && event.key.toLowerCase() === 'd' && !event.altKey && !event.ctrlKey && !event.metaKey) {
      settings.dark = !settings.dark; updateTheme();
    }
    const current = navLinks.indexOf(element);
    if (current !== -1 && (event.key === 'ArrowRight' || event.key === 'ArrowLeft')) {
      event.preventDefault();
      const direction = event.key === 'ArrowRight' ? 1 : -1;
      navLinks[(current + direction + navLinks.length) % navLinks.length].focus();
    }
  });
  const facts = [
    { name:'Tyrannosaurus rex', detail:'T. rex had powerful jaws and lived in the Late Cretaceous.' },
    { name:'Stegosaurus', detail:'Stegosaurus had large plates along its back and a spiked tail.' },
    { name:'Triceratops', detail:'Triceratops had three facial horns and a broad neck frill.' },
    { name:'Velociraptor', detail:'Velociraptor was a small feathered predator.' },
    { name:'Sauropods', detail:'Some sauropods had extremely long necks and ate plants.' }
  ];
  let factIndex = -1;
  $('#randomFact')?.addEventListener('click', () => {
    factIndex = (factIndex + 1 + Math.floor(Math.random() * (facts.length - 1))) % facts.length;
    const fact = facts[factIndex];
    const output = $('#factOutput');
    output.textContent = fact.name + ': ' + fact.detail;
    output.classList.remove('a5-pop'); void output.offsetWidth; output.classList.add('a5-pop');
    settings.playSound();
  });
  $('#showTime')?.addEventListener('click', () => {
    $('#timeOutput').textContent = 'Current time: ' + new Date().toLocaleTimeString(); settings.playSound();
  });
  $('#readMore')?.addEventListener('click', event => {
    const content = $('#extraInfo'); content.hidden = !content.hidden;
    event.currentTarget.textContent = content.hidden ? 'Read more' : 'Read less';
    event.currentTarget.setAttribute('aria-expanded', String(!content.hidden));
  });
  $$('#ratingStars button').forEach(button => button.addEventListener('click', () => {
    settings.rating = Number(button.dataset.rating);
    $$('#ratingStars button').forEach(star => {
      const selected = Number(star.dataset.rating) <= settings.rating;
      star.classList.toggle('selected', selected); star.textContent = selected ? '★' : '☆';
    });
    $('#ratingMessage').textContent = 'Thank you! Your rating: ' + settings.rating + '/5 stars.';
    settings.playSound();
  }));
  let step = 0;
  function renderStep() {
    $$('.a5-step').forEach((section, index) => { section.hidden = index !== step; });
    $('#stepBack').hidden = step === 0;
    $('#stepNext').hidden = step === 1;
    $('#stepFinish').hidden = step !== 1;
  }
  $('#stepNext')?.addEventListener('click', () => {
    if (!$('#explorerName').reportValidity()) return;
    step = 1; renderStep(); settings.playSound();
  });
  $('#stepBack')?.addEventListener('click', () => { step = 0; renderStep(); });
  $('#explorerForm')?.addEventListener('submit', event => {
    event.preventDefault();
    const name = $('#explorerName').value.trim();
    if (!name) { step = 0; renderStep(); $('#explorerName').focus(); return; }
    $('#explorerStatus').textContent = 'Welcome, ' + name + '! Your favorite dinosaur is ' + $('#explorerDino').value + '. (Demo: not sent to a server.)';
    settings.playSound(); event.currentTarget.reset(); step = 0; renderStep();
  });
  const cards = $$('.a5-dino-card');
  function filterDinosaurs(category) {
    let target;
    switch (category) {
      case 'carnivore': target = 'carnivore'; break;
      case 'herbivore': target = 'herbivore'; break;
      default: target = 'all';
    }
    let visible = 0;
    cards.forEach(card => {
      const show = target === 'all' || card.dataset.diet === target;
      card.hidden = !show;
      if (show) visible++;
    });
    $('#filterCount').textContent = 'Showing ' + visible + ' of ' + cards.length + ' dinosaurs.';
    $$('#dietFilters button').forEach(button => {
      const active = button.dataset.diet === target;
      button.classList.toggle('active', active);
      button.classList.toggle('btn-success', active);
      button.classList.toggle('btn-outline-success', !active);
      button.setAttribute('aria-pressed', String(active));
    });
  }
  if (cards.length) filterDinosaurs('all');
  $$('#dietFilters button').forEach(button => button.addEventListener('click', () => {
    filterDinosaurs(button.dataset.diet); settings.playSound();
  }));
});
