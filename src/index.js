let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // Toggle the display of the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  function renderAllToys(toys) {
    const toyCol = document.getElementById("toy-collection");
    
    toys.forEach((toy) => {
      const div = document.createElement("div");
      div.className = "card";
      div.innerHTML = `
        <h2>${toy.name}</h2>
        <img src="${toy.image}" width="100px" />
        <p>likes: ${toy.likes}</p>
        <button class="like-btn" id="${toy.id}">Like ❤️</button>
      `;

      const likeButton = div.querySelector(".like-btn");
      likeButton.addEventListener("click", () => {
        updateToyLikes(toy);
      });

      toyCol.appendChild(div);
    });
  }

  function updateToyLikes(toy) {
    const newNumberOfLikes = toy.likes + 1;

    fetch(`http://localhost:3000/toys/${toy.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        likes: newNumberOfLikes,
      }),
    })
      .then((res) => res.json())
      .then((updatedToy) => {
        // Update the displayed likes count
        const likeCountElement = document.querySelector(`[id="${updatedToy.id}"]`);
        likeCountElement.textContent = `likes: ${updatedToy.likes}`;
      })
      .catch((error) => {
        console.error("Error updating toy likes:", error);
      });
  }

  function addAnotherToy() {
    const nameInput = document.querySelector('input[name="name"]');
    const imageInput = document.querySelector('input[name="image"]');

    const name = nameInput.value;
    const image = imageInput.value;

    const newToy = {
      name: name,
      image: image,
      likes: 0, // Initialize likes to 0
    };

    fetch("http://localhost:3000/toys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(newToy),
    })
      .then((response) => response.json())
      .then((toy) => {
        // Display the newly added toy
        const toyCol = document.getElementById("toy-collection");
        renderAllToys([toy]);
      })
      .catch((error) => {
        console.error("Error adding a toy:", error);
      });
  }

  const form = document.querySelector(".add-toy-form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    addAnotherToy();
  });

  function getAllToys() {
    fetch("http://localhost:3000/toys")
      .then((res) => res.json())
      .then((toys) => renderAllToys(toys))
      .catch((error) => {
        console.error("Error fetching toys:", error);
      });
  }

  getAllToys();
});


