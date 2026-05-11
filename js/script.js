/* ============================================================
   PORTFÓLIO - LUIZ GUILHERME PENEDO PINTO
   Arquivo: script.js — toda a lógica JavaScript da página
   Funcionalidades:
     1. Alternância de tema claro / escuro
     2. Menu hamburguer responsivo (mobile)
     3. Scroll spy — destaca link ativo no menu
     4. Animações fade-up via IntersectionObserver
     5. Validação e simulação de envio do formulário
============================================================ */

// ============================================================
// 1. TEMA CLARO / ESCURO
//    Alterna a classe .light no <body> e salva preferência
// ============================================================

var themeBtn = document.getElementById('theme-toggle');
var body     = document.body;

// Recupera preferência salva no localStorage
var savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
  body.classList.add('light');
  themeBtn.textContent = '☀️';
}

// Alterna tema ao clicar no botão
themeBtn.addEventListener('click', function () {
  body.classList.toggle('light');

  var isLight = body.classList.contains('light');

  // Troca o ícone do botão
  themeBtn.textContent = isLight ? '☀️' : '🌙';

  // Persiste preferência do usuário
  localStorage.setItem('theme', isLight ? 'light' : 'dark');
});


// ============================================================
// 2. MENU HAMBURGUER (MOBILE)
//    Abre e fecha o menu de navegação em dispositivos pequenos
// ============================================================

var menuToggle = document.getElementById('menu-toggle');
var navLinks   = document.getElementById('nav-links');

// Abre ou fecha ao clicar no botão hamburguer
menuToggle.addEventListener('click', function () {
  navLinks.classList.toggle('open');
});

// Fecha o menu ao clicar em qualquer link (melhora UX em mobile)
var links = navLinks.querySelectorAll('a');
for (var i = 0; i < links.length; i++) {
  links[i].addEventListener('click', function () {
    navLinks.classList.remove('open');
  });
}


// ============================================================
// 3. SCROLL SPY
//    Destaca o link do menu correspondente à seção visível
// ============================================================

var sections   = document.querySelectorAll('section[id]');
var navAnchors = document.querySelectorAll('.nav-link');

function updateActiveLink() {
  var current = '';

  // Percorre todas as seções e identifica qual está visível
  for (var s = 0; s < sections.length; s++) {
    var top = sections[s].getBoundingClientRect().top;

    // Seção cujo topo já entrou na janela (com margem do nav)
    if (top <= 90) {
      current = sections[s].getAttribute('id');
    }
  }

  // Aplica / remove classe .active nos links do menu
  for (var a = 0; a < navAnchors.length; a++) {
    navAnchors[a].classList.remove('active');
    if (navAnchors[a].getAttribute('href') === '#' + current) {
      navAnchors[a].classList.add('active');
    }
  }
}

// Executa a cada evento de scroll
window.addEventListener('scroll', updateActiveLink, { passive: true });

// Executa uma vez ao carregar a página
updateActiveLink();


// ============================================================
// 4. ANIMAÇÃO FADE-UP
//    Usa IntersectionObserver para animar elementos ao entrar
//    na viewport — mais eficiente que ouvir o evento scroll
// ============================================================

var fadeEls = document.querySelectorAll('.fade-up');

// Callback chamado quando um elemento intersecta a viewport
var observer = new IntersectionObserver(function (entries) {
  for (var e = 0; e < entries.length; e++) {
    if (entries[e].isIntersecting) {
      // Adiciona .visible → o CSS anima opacity e translateY
      entries[e].target.classList.add('visible');

      // Para de observar após animar (economiza recursos)
      observer.unobserve(entries[e].target);
    }
  }
}, { threshold: 0.12 }); // 12% do elemento visível dispara

// Registra cada elemento com .fade-up para ser observado
for (var f = 0; f < fadeEls.length; f++) {
  observer.observe(fadeEls[f]);
}


// ============================================================
// 5. VALIDAÇÃO E ENVIO DO FORMULÁRIO DE CONTATO
//    Verifica os campos antes de "enviar" e exibe modal
// ============================================================

var form         = document.getElementById('contact-form');
var inputNome    = document.getElementById('nome');
var inputEmail   = document.getElementById('email');
var inputMsg     = document.getElementById('mensagem');
var errNome      = document.getElementById('err-nome');
var errEmail     = document.getElementById('err-email');
var errMsgEl     = document.getElementById('err-mensagem');
var modalOverlay = document.getElementById('modal-overlay');
var modalClose   = document.getElementById('modal-close');

// --- Função auxiliar: valida formato de e-mail com expressão regular ---
// Padrão exigido: algo@algo.com (usuario@dominio.extensao)
function isValidEmail(email) {
  var regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// Remove marcação de erro ao usuário começar a digitar novamente
inputNome.addEventListener('input', function () {
  inputNome.classList.remove('error');
  errNome.classList.remove('show');
});

inputEmail.addEventListener('input', function () {
  inputEmail.classList.remove('error');
  errEmail.classList.remove('show');
});

inputMsg.addEventListener('input', function () {
  inputMsg.classList.remove('error');
  errMsgEl.classList.remove('show');
});

// --- Evento de submissão ---
form.addEventListener('submit', function (e) {
  // Impede o comportamento padrão (recarregar a página)
  e.preventDefault();

  var nome     = inputNome.value.trim();
  var email    = inputEmail.value.trim();
  var mensagem = inputMsg.value.trim();
  var valido   = true;

  // Validação 1: nome não pode estar vazio
  if (nome === '') {
    inputNome.classList.add('error');
    errNome.classList.add('show');
    valido = false;
  } else {
    inputNome.classList.remove('error');
    errNome.classList.remove('show');
  }

  // Validação 2: e-mail não pode estar vazio e deve ter formato válido
  if (email === '' || !isValidEmail(email)) {
    inputEmail.classList.add('error');
    errEmail.classList.add('show');
    valido = false;
  } else {
    inputEmail.classList.remove('error');
    errEmail.classList.remove('show');
  }

  // Validação 3: mensagem não pode estar vazia
  if (mensagem === '') {
    inputMsg.classList.add('error');
    errMsgEl.classList.add('show');
    valido = false;
  } else {
    inputMsg.classList.remove('error');
    errMsgEl.classList.remove('show');
  }

  // Se todos os campos passaram na validação → simula o envio
  if (valido) {
    // Limpa os campos do formulário
    form.reset();

    // Exibe o modal de confirmação
    modalOverlay.classList.add('open');
  }
});

// --- Fecha o modal ao clicar no botão "Fechar" ---
modalClose.addEventListener('click', function () {
  modalOverlay.classList.remove('open');
});

// --- Fecha o modal ao clicar fora da caixa (no overlay) ---
modalOverlay.addEventListener('click', function (e) {
  if (e.target === modalOverlay) {
    modalOverlay.classList.remove('open');
  }
});
