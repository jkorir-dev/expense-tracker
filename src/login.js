import { isUserLoggedIn, loginUser, registerUser } from './auth.js';
import { initializeTracker } from './tracker.js';

const loginShell = document.querySelector('.login-shell');
const trackerPage = document.getElementById('tracker-page');
const form = document.getElementById('auth-form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const title = document.getElementById('login-title');
const description = document.getElementById('login-description');
const submitButton = document.getElementById('submit-button');
const modeSwitch = document.getElementById('mode-switch');
const modeSwitchCopy = document.getElementById('mode-switch-copy');
const message = document.getElementById('form-message');
const trackerUserEmail = document.getElementById('tracker-user-email');
const dashboardSignOutButton = document.getElementById('dashboard-sign-out');

let isRegistering = false;

function showMessage(text, type = 'error') {
  message.textContent = text;
  message.className = `form-message ${type}`;
}

function openTracker(email) {
  document.body.classList.remove('auth-page');
  loginShell.hidden = true;
  trackerPage.hidden = false;
  trackerUserEmail.textContent = email;
  document.title = 'Expenses · Global Expense Tracker';
  initializeTracker();
}

function resetSignedInView() {
  form.hidden = false;
  modeSwitchCopy.hidden = false;
  title.textContent = isRegistering ? 'Create your account' : 'Welcome back';
  description.textContent = isRegistering
    ? 'Start bringing your spending into focus across every currency.'
    : 'Sign in to see your spending clearly, wherever life takes you.';
}

function setMode(registering) {
  isRegistering = registering;
  submitButton.textContent = registering ? 'Create account' : 'Sign in';
  modeSwitchCopy.firstChild.textContent = registering ? 'Already have an account? ' : 'New here? ';
  modeSwitch.textContent = registering ? 'Sign in' : 'Create an account';
  passwordInput.autocomplete = registering ? 'new-password' : 'current-password';
  showMessage('');
  resetSignedInView();
}

modeSwitch.addEventListener('click', () => setMode(!isRegistering));

form.addEventListener('submit', event => {
  event.preventDefault();
  const email = emailInput.value.trim().toLowerCase();
  const password = passwordInput.value;

  try {
    if (isRegistering) {
      registerUser(email, password);
    }
    loginUser(email, password);
    openTracker(email);
  } catch (error) {
    showMessage(error instanceof Error ? error.message : 'Something went wrong. Please try again.');
  }
});

dashboardSignOutButton.addEventListener('click', () => {
  sessionStorage.removeItem('active_session');
  trackerPage.hidden = true;
  loginShell.hidden = false;
  document.body.classList.add('auth-page');
  document.title = 'Sign in · Global Expense Tracker';
  form.reset();
  setMode(false);
  showMessage('You have been signed out.', 'success');
  emailInput.focus();
});

if (isUserLoggedIn()) {
  openTracker(sessionStorage.getItem('active_session'));
}