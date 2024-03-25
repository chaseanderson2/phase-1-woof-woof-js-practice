document.addEventListener("DOMContentLoaded", () => {
    const dogBar = document.getElementById("dog-bar");
    const dogInfo = document.getElementById("dog-info");
    const filterButton = document.getElementById("good-dog-filter");
  
    let filterOn = false;

    fetch("http://localhost:3000/pups")
    .then(response => response.json())
    .then(data => {
      data.forEach(pup => {
        const pupSpan = document.createElement("span");
        pupSpan.textContent = pup.name;

        pupSpan.addEventListener("click", () => {
          showPupInfo(pup);
        });

        dogBar.appendChild(pupSpan);
      });
    })
    .catch(error => console.log(error));

    function showPupInfo(pup) {
        dogInfo.innerHTML = `
          <img src="${pup.image}" alt="${pup.name}" />
          <h2>${pup.name}</h2>
          <button>${pup.isGoodDog ? "Good Dog!" : "Bad Dog!"}</button>
        `;
    
        const toggleButton = dogInfo.querySelector("button");
        toggleButton.addEventListener("click", () => {
          toggleGoodDog(pup, toggleButton);
        });
      }

      function toggleGoodDog(pup, button) {
        const updatedStatus = !pup.isGoodDog;
        button.textContent = updatedStatus ? "Good Dog!" : "Bad Dog!";
    
        fetch(`http://localhost:3000/pups/${pup.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            isGoodDog: updatedStatus,
          }),
        })
          .then(response => response.json())
          .then(data => {
            pup.isGoodDog = data.isGoodDog;
          })
          .catch(error => console.log(error));
      }

      filterButton.addEventListener("click", () => {
        filterOn = !filterOn;
        filterButton.textContent = filterOn
          ? "Filter good dogs: ON"
          : "Filter good dogs: OFF";
        filterDogs();
      });
    
      function filterDogs() {
        if (filterOn) {
          const pups = Array.from(dogBar.children);
          pups.forEach(pup => {
            const pupName = pup.textContent;
            const isGoodDog = data.find(dog => dog.name === pupName).isGoodDog;
            pup.style.display = isGoodDog ? "inline" : "none";
          });
        } else {
          dogBar.querySelectorAll("span").forEach(pup => {
            pup.style.display = "inline";
          });
        }
      }
    });