document.addEventListener("DOMContentLoaded", () => {
  const toyCollection = document.getElementById('toy-collection');
  const addToyForm = document.querySelector('.add-toy-form');
  const newToyBtn = document.getElementById('new-toy-btn');
  const toyFormContainer = document.querySelector('.container');
  
  const toyUrl = 'http://localhost:3000/toys';

  // Fetch and display all toys
  function fetchToys() {
    fetch(toyUrl)
      .then(response => response.json())
      .then(toys => {
        toys.forEach(toy => {
          createToyCard(toy);
        });
      })
      .catch(error => console.error('Error fetching toys:', error));
  }

  // Create a toy card
  function createToyCard(toy) {
    const card = document.createElement('div');
    card.className = 'card';

    const toyName = document.createElement('h2');
    toyName.textContent = toy.name;

    const toyImage = document.createElement('img');
    toyImage.src = toy.image;
    toyImage.className = 'toy-avatar';

    const toyLikes = document.createElement('p');
    toyLikes.textContent = `${toy.likes} Likes`;

    const likeBtn = document.createElement('button');
    likeBtn.className = 'like-btn';
    likeBtn.id = toy.id;
    likeBtn.textContent = 'Like ❤️';
    likeBtn.addEventListener('click', () => increaseLikes(toy, toyLikes));

    card.appendChild(toyName);
    card.appendChild(toyImage);
    card.appendChild(toyLikes);
    card.appendChild(likeBtn);

    toyCollection.appendChild(card);
  }

  // Add a new toy
  addToyForm.addEventListener('submit', event => {
    event.preventDefault();
    const toyName = event.target.name.value;
    const toyImage = event.target.image.value;

    const newToy = {
      name: toyName,
      image: toyImage,
      likes: 0
    };

    fetch(toyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(newToy)
    })
    .then(response => response.json())
    .then(toy => {
      createToyCard(toy);
      addToyForm.reset();
    })
    .catch(error => console.error('Error adding toy:', error));
  });

  // Increase likes
  function increaseLikes(toy, toyLikesElement) {
    const newLikes = toy.likes + 1;

    fetch(`${toyUrl}/${toy.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ likes: newLikes })
    })
    .then(response => response.json())
    .then(updatedToy => {
      toy.likes = updatedToy.likes;
      toyLikesElement.textContent = `${updatedToy.likes} Likes`;
    })
    .catch(error => console.error('Error updating likes:', error));
  }

  // Toggle form display
  newToyBtn.addEventListener('click', () => {
    toyFormContainer.style.display = toyFormContainer.style.display === 'block' ? 'none' : 'block';
  });

  // Initial fetch of toys
  fetchToys();
});
