// add new post
async function newFormHandler(event) {
  event.preventDefault();

  const post_title = document.querySelector('#post-title').value;
  const post_text = document.querySelector('#post-text').value;

  try {
      const response = await fetch('/api/posts', {
          method: 'POST',
          body: JSON.stringify({
              post_title,
              post_text,
          }),
          headers: {
              'Content-Type': 'application/json',
          },
      });

      // check the response status
      if (response.ok) {
          document.location.replace('/dashboard');
      } else {
          alert(response.statusText);
      }
  } catch (error) {
      alert(error);
  }
}

document
  .querySelector('.new-post-form')
  .addEventListener('submit', newFormHandler);