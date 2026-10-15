export function convertCurrency(amount, fromCurrency, baseRates) {
  if (!baseRates || typeof baseRates !== 'object') return 0;
  
  const conversionRate = baseRates[fromCurrency];
  if (!conversionRate || conversionRate <= 0) return 0;
  
  const converted = amount / conversionRate;
  return parseFloat(converted.toFixed(2));
}

export function calculateTotal(expenses, baseRates) {
  return expenses.reduce((sum, item) => {
    const costInHomeCurrency = convertCurrency(item.amount, item.currency, baseRates);
    return sum + costInHomeCurrency;
  }, 0);
}

export function filterByCategory(expenses, category) {
  if (!category || category === 'All') {
    return expenses;
  }
  return expenses.filter(item => item.category === category);
}
