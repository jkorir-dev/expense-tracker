let state = {
  expenses: JSON.parse(localStorage.getItem('saved_expenses')) || [],
  homeCurrency: 'USD',
  rates: {}
};

function saveToStorage() {
  localStorage.setItem('saved_expenses', JSON.stringify(state.expenses));
}

export function getState() {
  return state;
}

export function setRates(newRates) {
  state = { ...state, rates: newRates };
}

export function setHomeCurrency(currency) {
  state = { ...state, homeCurrency: currency };
}

export function addExpense(expense) {
  const updatedExpenses = [...state.expenses, expense];
  state = { ...state, expenses: updatedExpenses };
  saveToStorage();
}

export function updateExpenseCategory(id, newCategory) {
  const updatedExpenses = state.expenses.map(item => {
    if (item.id === id) {
      return { ...item, category: newCategory };
    }
    return item;
  });
  state = { ...state, expenses: updatedExpenses };
  saveToStorage();
}
