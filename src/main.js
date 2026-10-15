import { fetchExchangeRates } from './api.js';
import { getState, setRates, setHomeCurrency, addExpense } from './state.js';
import { renderApp, getFormInputs, clearForm, showStatus, hideStatus, restrictToPastDates, populateCurrencyDatalist, elements } from './ui.js';

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

  handleSyncRates();
});
