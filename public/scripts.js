document
  .getElementById('loginForm')
  .addEventListener('submit', async function (event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    console.log(username, password);

    const response = await fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }), // Convert the body to a JSON string
    });

    const result = await response.json();

    const loginMessage = document.getElementById('loginMessage');
    if (result.success) {
      loginMessage.style.color = 'green';
      loginMessage.textContent = 'Login successful!';
      window.location.href = '/door.html';
    } else {
      loginMessage.style.color = 'red';
      loginMessage.textContent = 'Login failed. Please try again.';
    }
  });
