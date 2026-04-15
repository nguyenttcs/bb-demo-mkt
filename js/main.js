'use strict';

// =============================================
// Elements
// =============================================

const screen0 = document.getElementById('screen-0');
const screen1 = document.getElementById('screen-1');
const screen2 = document.getElementById('screen-2');
const screen3 = document.getElementById('screen-3');
const screen4 = document.getElementById('screen-4');
const screen5 = document.getElementById('screen-5');
const screen6 = document.getElementById('screen-6');
const screen7 = document.getElementById('screen-7');

const inputName     = document.getElementById('input-name');
const inputBusiness = document.getElementById('input-business');
const inputEmail    = document.getElementById('input-email');
const inputOtp      = document.getElementById('input-otp');
const inputPhone    = document.getElementById('input-phone');
const inputPhoneOtp = document.getElementById('input-phone-otp');
const displayEmail  = document.getElementById('display-email');
const displayPhone  = document.getElementById('display-phone');

const btnGetStarted  = document.getElementById('btn-get-started');
const btnNext1       = document.getElementById('btn-next-1');
const btnNext2       = document.getElementById('btn-next-2');
const btnNext3       = document.getElementById('btn-next-3');
const btnBack3       = document.getElementById('btn-back-3');
const btnResend      = document.getElementById('btn-resend');
const btnSendCode    = document.getElementById('btn-send-code');
const btnBack5       = document.getElementById('btn-back-5');
const btnNext5       = document.getElementById('btn-next-5');
const btnResendPhone = document.getElementById('btn-resend-phone');
const btnNext6       = document.getElementById('btn-next-6');
const btnGotoHome    = document.getElementById('btn-goto-home');
const successIcon    = document.getElementById('success-icon');
const businessCards  = document.querySelectorAll('.business-card');

// Country dropdown
const countrySelector = document.getElementById('country-selector');
const countryDropdown = document.getElementById('country-dropdown');
const countryDisplay  = document.getElementById('country-display');
const countryOptions  = countryDropdown.querySelectorAll('.country-option');

// =============================================
// Screen 0 → Screen 1 (Get Started)
// =============================================

btnGetStarted.addEventListener('click', () => {
  goTo(screen0, screen1, inputName);
});

// =============================================
// Screen 1 → Screen 2
// =============================================

btnNext1.addEventListener('click', () => {
  if (!inputName.value.trim())     { markError(inputName);     return; }
  if (!inputBusiness.value.trim()) { markError(inputBusiness); return; }
  goTo(screen1, screen2, inputEmail);
});

// =============================================
// Screen 2 → Screen 3
// =============================================

btnNext2.addEventListener('click', () => {
  const email = inputEmail.value.trim();
  if (!isValidEmail(email)) { markError(inputEmail); return; }
  clearError(inputEmail);
  displayEmail.textContent = email;
  goTo(screen2, screen3, inputOtp);
});

// =============================================
// Screen 3 — Back / Next / Resend
// =============================================

btnBack3.addEventListener('click', () => {
  goTo(screen3, screen2, inputEmail);
});

btnNext3.addEventListener('click', () => {
  const code = inputOtp.value.trim();
  if (code.length < 6) { markError(inputOtp); return; }
  clearError(inputOtp);
  goTo(screen3, screen4, inputPhone);
});

btnResend.addEventListener('click', () => {
  console.log('Resend code requested');
});

// =============================================
// Screen 4 — Country dropdown
// =============================================

countrySelector.addEventListener('click', () => {
  const isOpen = countrySelector.getAttribute('aria-expanded') === 'true';
  if (isOpen) {
    closeDropdown();
  } else {
    openDropdown();
  }
});

countryOptions.forEach((option) => {
  option.addEventListener('click', () => {
    const code  = option.dataset.code;
    const label = option.dataset.label;

    countryDisplay.innerHTML = `${label} <strong>${code}</strong>`;

    countryOptions.forEach(o => o.classList.remove('selected'));
    option.classList.add('selected');

    closeDropdown();
    // Focus phone after selecting country — keeps numeric keyboard ready
    inputPhone.focus();
  });
});

// Close dropdown when tapping outside
document.addEventListener('click', (e) => {
  if (!countrySelector.contains(e.target) && !countryDropdown.contains(e.target)) {
    closeDropdown();
  }
});

function openDropdown() {
  countryDropdown.classList.remove('hidden');
  countrySelector.setAttribute('aria-expanded', 'true');
}

function closeDropdown() {
  countryDropdown.classList.add('hidden');
  countrySelector.setAttribute('aria-expanded', 'false');
}

// =============================================
// Screen 4 — Send Code
// =============================================

btnSendCode.addEventListener('click', () => {
  const digits = inputPhone.value.replace(/\D/g, '');
  if (digits.length < 10) { markError(inputPhone); return; }
  clearError(inputPhone);
  displayPhone.textContent = inputPhone.value.trim();
  goTo(screen4, screen5, inputPhoneOtp);
});

// =============================================
// Screen 5 — Verify phone OTP
// =============================================

btnBack5.addEventListener('click', () => {
  inputPhoneOtp.value = '';
  goTo(screen5, screen4, inputPhone);
});

btnNext5.addEventListener('click', () => {
  const code = inputPhoneOtp.value.trim();
  if (code.length < 6) { markError(inputPhoneOtp); return; }
  clearError(inputPhoneOtp);
  goTo(screen5, screen6, null);
});

btnResendPhone.addEventListener('click', () => {
  console.log('Resend phone code requested');
});

// =============================================
// Screen 6 — Type of Business
// =============================================

businessCards.forEach((card) => {
  card.addEventListener('click', () => {
    businessCards.forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
  });
});

btnNext6.addEventListener('click', () => {
  screen6.classList.add('hidden');
  screen7.classList.remove('hidden');
  // Trigger success icon animation after paint
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      successIcon.classList.add('animate');
    });
  });
});

// =============================================
// Screen 7 — Success
// =============================================

btnGotoHome.addEventListener('click', () => {
  // Reset all and go back to screen 1
  successIcon.classList.remove('animate');
  inputName.value = '';
  inputBusiness.value = '';
  inputEmail.value = '';
  inputOtp.value = '';
  inputPhone.value = '';
  inputPhoneOtp.value = '';
  businessCards.forEach((c, i) => {
    c.classList.toggle('selected', i === 0);
  });
  screen7.classList.add('hidden');
  screen0.classList.remove('hidden');
});

// =============================================
// OTP — digits only, auto-dismiss at 6
// =============================================

[inputOtp, inputPhoneOtp].forEach((input) => {
  input.addEventListener('input', () => {
    input.value = input.value.replace(/\D/g, '').slice(0, 6);
    clearError(input);
    if (input.value.length === 6) input.blur();
  });
});

// Phone — format as xxx xxx xxxx (US style) while typing
inputPhone.addEventListener('input', (e) => {
  const digits = inputPhone.value.replace(/\D/g, '').slice(0, 10);
  inputPhone.value = formatUSPhone(digits);
  clearError(inputPhone);
});

function formatUSPhone(digits) {
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
  return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
}

// =============================================
// Enter key navigation
// =============================================

inputName.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') { e.preventDefault(); inputBusiness.focus(); }
});
inputBusiness.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') { e.preventDefault(); btnNext1.click(); }
});
inputEmail.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') { e.preventDefault(); btnNext2.click(); }
});
inputOtp.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') { e.preventDefault(); btnNext3.click(); }
});
inputPhoneOtp.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') { e.preventDefault(); btnNext5.click(); }
});
inputPhone.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') { e.preventDefault(); btnSendCode.click(); }
});

// =============================================
// Helpers
// =============================================

function goTo(from, to, focusTarget) {
  from.classList.add('hidden');
  to.classList.remove('hidden');
  // Synchronous focus inside user-gesture → iOS opens keyboard immediately
  if (focusTarget) focusTarget.focus();
}

function markError(input) {
  input.classList.add('error');
  input.focus();
  input.addEventListener('input', () => clearError(input), { once: true });
}

function clearError(input) {
  input.classList.remove('error');
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
