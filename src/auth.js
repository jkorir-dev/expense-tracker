export function registerUser(email, password) {
  const users = JSON.parse(localStorage.getItem('tracker_users')) || {};
  if (users[email]) {
    throw new Error('An account with this email address already exists.');
  }
  users[email] = password;
  localStorage.setItem('tracker_users', JSON.stringify(users));
}

export function loginUser(email, password) {
  const users = JSON.parse(localStorage.getItem('tracker_users')) || {};
  if (!users[email] || users[email] !== password) {
    throw new Error('Invalid email profile parameters or password mismatch.');
  }
  sessionStorage.setItem('active_session', email);
}

export function isUserLoggedIn() {
  return sessionStorage.getItem('active_session') !== null;
}
