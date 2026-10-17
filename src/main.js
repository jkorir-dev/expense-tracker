import { fetchExchangeRates } from './api.js';
import { getState, setRates, setHomeCurrency, addExpense } from './state.js';
import { renderApp, getFormInputs, clearForm, showStatus, hideStatus, restrictToPastDates, populateCurrencyDatalist, toggleAuthView, elements } from './ui.js';
import { registerUser, loginUser, isUserLoggedIn } from './auth.js';

let isSignUpMode = false;

async function handleSyncRates() {
  const currentState = getState();
  showStatus(`Fetching live exchange tracking rates for ${currentState.homeCurrency}...`, 'info');
  try {
    const rates = await fetchExchangeRates(currentState.homeCurrency);
    setRates(rates);
    populateCurrencyDatalist(rates);
    hideStatus();
    renderApp(currentState);
  } catch (error) {
    showStatus(`Network Sync Error: ${error.message}. Displaying un-updated historical reference parameters.`, 'error');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  restrictToPastDates();
  toggleAuthView(isUserLoggedIn());

  const authForm = document.getElementById('auth-form');
  const toggleLink = document.getElementById('auth-toggle-link');
  const authTitle = document.getElementById('auth-title');
  const submitBtn = document.getElementById('auth-submit-btn');
  const toggleMsg = document.getElementById('auth-toggle-msg');

  toggleLink.addEventListener('click', (e) => {
    e.preventDefault();
    isSignUpMode = !isSignUpMode;
    authTitle.textContent = isSignUpMode ? 'Create Your Account' : 'Welcome to Expense Tracker';
    submitBtn.textContent = isSignUpMode ? 'Sign Up' : 'Log In';
    toggleMsg.textContent = isSignUpMode ? 'Already have an account?' : "Don't have an account?";
    toggleLink.textContent = isSignUpMode ? 'Log In' : 'Sign Up';
  });

  authForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('auth-email').value.trim();
    const password = document.getElementById('auth-password').value;

    try {
      if (isSignUpMode) {
        registerUser(email, password);
        alert('Registration complete! You can now log in.');
        toggleLink.click();
      } else {
        loginUser(email, password);
        toggleAuthView(true);
        handleSyncRates();
      }
    } catch (err) {
      alert(err.message);
    }
  });

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const inputs = getFormInputs();
    const newExpense = {
      id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
      ...inputs
    };
    addExpense(newExpense);
    clearForm();
    renderApp(getState());
  });

  elements.homeCurrencySelect.addEventListener('input', (e) => {
    const val = e.target.value.toUpperCase().trim();
    if (val.length === 3) {
      setHomeCurrency(val);
      handleSyncRates();
    }
  });

  elements.filterCategorySelect.addEventListener('change', () => {
    renderApp(getState());
  });

  if (isUserLoggedIn()) {
    handleSyncRates();
  }
});
