async function logout() {
  try {
      const response = await fetch('/api/users/logout', {
          method: 'post',
          headers: { 'Content-Type': 'application/json' },
      });

      // check the response status
      if (response.ok) {
          document.location.replace('/');
      } else {
          alert(response.statusText);
      }
  } catch (error) {
      alert(error);
  }
}

document.querySelector('#logout').addEventListener('click', logout);