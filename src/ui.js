import { filterByCategory, calculateTotal, convertCurrency } from './utils.js';

const elements = {
  form: document.getElementById('expense-form'),
  descInput: document.getElementById('exp-desc'),
  amountInput: document.getElementById('exp-amount'),
  currencyInput: document.getElementById('exp-currency'),
  dateInput: document.getElementById('exp-date'),
  categoryInput: document.getElementById('exp-category'),
  homeCurrencySelect: document.getElementById('home-currency'),
  filterCategorySelect: document.getElementById('filter-category'),
  expenseListTable: document.getElementById('expense-list'),
  totalDisplay: document.getElementById('total-display'),
  statusMessage: document.getElementById('status-message'),
  currencyDatalist: document.getElementById('currency-list')
};

export function getFormInputs() {
  return {
    description: elements.descInput.value.trim(),
    amount: parseFloat(elements.amountInput.value),
    currency: elements.currencyInput.value.toUpperCase().trim(),
    date: elements.dateInput.value,
    category: elements.categoryInput.value
  };
}

export function clearForm() {
  elements.form.reset();
  restrictToPastDates();
}

export function showStatus(message, type = 'info') {
  elements.statusMessage.textContent = message;
  elements.statusMessage.className = `status-message ${type}`;
}

export function hideStatus() {
  elements.statusMessage.className = 'status-message hidden';
}

export function restrictToPastDates() {
  const today = new Date().toISOString().split('T')[0];
  elements.dateInput.setAttribute('max', today);
}

export function populateCurrencyDatalist(rates) {
  if (!rates) return;
  elements.currencyDatalist.innerHTML = '';
  Object.keys(rates).forEach(currency => {
    const option = document.createElement('option');
    option.value = currency;
    elements.currencyDatalist.appendChild(option);
  });
}

export function renderApp(state) {
  const selectedCategory = elements.filterCategorySelect.value;
  const filtered = filterByCategory(state.expenses, selectedCategory);
  
  elements.expenseListTable.innerHTML = '';
  
  filtered.forEach(item => {
    const tr = document.createElement('tr');
    const convertedVal = convertCurrency(item.amount, item.currency, state.rates);
    
    tr.innerHTML = `
      <td>${item.date}</td>
      <td><strong>${escapeHtml(item.description)}</strong></td>
      <td><span class="badge">${item.category}</span></td>
      <td>${item.amount.toFixed(2)} ${item.currency}</td>
      <td>${convertedVal.toFixed(2)} ${state.homeCurrency}</td>
    `;
    elements.expenseListTable.appendChild(tr);
  });
  
  const grandTotal = calculateTotal(state.expenses, state.rates);
  elements.totalDisplay.textContent = `${grandTotal.toFixed(2)} ${state.homeCurrency}`;
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

export { elements };
