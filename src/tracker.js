import { fetchExchangeRates } from './api.js';
import { addExpense, getState, setHomeCurrency, setRates } from './state.js';
import {
  clearForm,
  elements,
  getFormInputs,
  hideStatus,
  populateCurrencyDatalist,
  renderApp,
  restrictToPastDates,
  showStatus
} from './ui.js';

const emptyState = document.getElementById('empty-expenses');
let isInitialized = false;
let rateRequestId = 0;

function renderTracker() {
  const state = getState();
  renderApp(state);
  emptyState.hidden = state.expenses.length > 0;
}

async function refreshRates(currency) {
  const currentRequest = ++rateRequestId;
  try {
    const rates = await fetchExchangeRates(currency);
    if (currentRequest !== rateRequestId) return;
    setRates(rates);
    populateCurrencyDatalist(rates);
    renderTracker();
  } catch {
    showStatus('Exchange rates are unavailable right now. Try again in a moment.', 'error');
  }
}

export function initializeTracker() {
  if (isInitialized) {
    renderTracker();
    return;
  }
  isInitialized = true;

  const state = getState();
  elements.homeCurrencySelect.value = state.homeCurrency;
  elements.dateInput.value = new Date().toISOString().split('T')[0];
  restrictToPastDates();
  hideStatus();

  elements.form.addEventListener('submit', event => {
    event.preventDefault();
    const expense = getFormInputs();
    if (!Number.isFinite(expense.amount) || expense.amount <= 0) {
      showStatus('Enter an amount greater than zero.', 'error');
      return;
    }

    addExpense({ ...expense, id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}` });
    clearForm();
    elements.dateInput.value = new Date().toISOString().split('T')[0];
    elements.currencyInput.value = getState().homeCurrency;
    hideStatus();
    renderTracker();
  });

  elements.homeCurrencySelect.addEventListener('change', () => {
    setHomeCurrency(elements.homeCurrencySelect.value);
    elements.currencyInput.value = elements.homeCurrencySelect.value;
    renderTracker();
    refreshRates(elements.homeCurrencySelect.value);
  });

  elements.filterCategorySelect.addEventListener('change', renderTracker);
  renderTracker();
  refreshRates(state.homeCurrency);
}
