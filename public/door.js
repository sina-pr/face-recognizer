const doorCheckbox = document.getElementById('doorCheckbox');
const doorMessage = document.getElementById('doorMessage');

doorCheckbox.addEventListener('change', async function () {
  if (this.checked) {
    const response = await fetch('/open-door');
    const result = await response.json();

    if (result.success) {
      doorMessage.style.color = '#04b065';
      doorMessage.textContent = 'Door opened successfully!';
    } else {
      doorMessage.style.color = 'red';
      doorMessage.textContent = 'Failed to open door: ' + result.message;
    }

    doorMessage.classList.add('show');

    // Hide the popup after 3 seconds
    setTimeout(() => {
      doorMessage.classList.remove('show');
    }, 3000);
  } else {
    doorMessage.textContent = '';
  }
});
