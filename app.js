const typeImageMap = {
  bug: "bug.png",
  dark: "dark.png",
  dragon: "dragon.png",
  electric: "electric.png",
  fairy: "fairy.png",
  fighting: "fighting.png",
  fire: "fire.png",
  flying: "flying.png",
  ghost: "ghost.png",
  grass: "grass.png",
  ground: "ground.png",
  ice: "ice.png",
  normal: "normal.png",
  poison: "poison.png",
  psychic: "psychic.png",
  rock: "rock.png",
  steel: "steel.png",
  water: "water.png",
};

const typeTextColors = {
    bug: "green",
    dark: "darkred",
    dragon: "darkorange",
    electric: "yellow",
    fairy: "pink",
    fighting: "red",
    fire: "orangered",
    flying: "skyblue",
    ghost: "purple",
    grass: "green",
    ground: "burlywood",
    ice: "deepskyblue",
    normal: "gray",
    poison: "purple",
    psychic: "pink",
    rock: "brown",
    steel: "gray",
    water: "blue",
  };

function getImageFilename(pokemonTypes, directory) {
  for (const type of pokemonTypes) {
      const typeName = type.type.name;
      if (typeImageMap[typeName]) {
          return typeImageMap[typeName];
      }
  }
  return "default.png";
}

// Create a cache object to store fetched Pokémon data
const pokemonDataCache = {};

async function getPokemonData(pokemonId) {
  if (!pokemonDataCache[pokemonId]) {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
      pokemonDataCache[pokemonId] = await response.json();
  }
  return pokemonDataCache[pokemonId];
}

async function createPokemonCards() {
  const pokemonList = document.getElementById("pokemon-list");
  const searchInput = document.getElementById("search-input");

  // Clear the existing Pokémon cards
  pokemonList.innerHTML = "";

  const pokemonData = [];

  for (let pokemonId = 1; pokemonId <= 1010; pokemonId++) {
      const pokemonInfo = await getPokemonData(pokemonId);

      const pokemonName = pokemonInfo.name.toLowerCase();
      const pokemonTypes = pokemonInfo.types;
      const hp = pokemonInfo.stats.find((stat) => stat.stat.name === "hp").base_stat;
      const attack = pokemonInfo.stats.find((stat) => stat.stat.name === "attack").base_stat;

      if (searchInput.value.trim() === "" || pokemonName.includes(searchInput.value.trim().toLowerCase())) {
          pokemonData.push({
              id: pokemonId,
              name: pokemonName,
              types: pokemonTypes,
              hp: hp,
              attack: attack,
          });
      }
  }

  return pokemonData;
}
  
  function renderPokemonCards(pokemonData) {
    const pokemonList = document.getElementById("pokemon-list");
  
    pokemonData.forEach((pokemon) => {
      const typeImages = pokemon.types.map((type) => getImageFilename([type], "icons"));
      const typeNames = pokemon.types.map((type) => {
        const typeName = type.type.name;
        return typeName.charAt(0).toUpperCase() + typeName.slice(1);
      });
  
      const spriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`;
  
      const typeClassNames = pokemon.types.map((type) => getTypeClassName(type));
      const typeTextColors = pokemon.types.map((type) => {
        const typeName = type.type.name;
        // return typeTextColors[typeName];
      });
  
      const pokemonCard = document.createElement("div");
      pokemonCard.classList.add("poke-card");
      pokemonCard.innerHTML = `
        <div class="poke-back">
          <img src="backgrounds/${typeImages[0]}" alt="${typeImages[0]}">
          <img src="${spriteUrl}" alt="${pokemon.name}" class="pokemon-sprite">
        </div>
        <div class="poke-data">
            <div class="typeContainer">
                <div class="poke-type">
                    <span class="text-${typeClassNames[0]}" style="color: ${typeTextColors[0]}">${typeNames[0]}</span>
                    ${typeNames[1] ? `<span class="text-${typeClassNames[1]}" style="color: ${typeTextColors[1]}">${typeNames[1]}</span>` : ''}
                </div>
                <span class="poke-id">#${pokemon.id}</span>
            </div>
          <h2 class="poke-name">${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h2>
          <p>HP: ${pokemon.hp}</p>
          <p>Attack: ${pokemon.attack}</p>
          <img src="icons/${typeNames[0]}.png" alt="${typeNames[0]}" class="poke-icon">
          <img src="icons/${typeNames[0]}.png" alt="${typeNames[0]}" class="poke-icon">
        </div>
      `;
  
      pokemonList.appendChild(pokemonCard);
    });
  }
  
  
  
  
  
  

// Helper function to get the class name for a type
function getTypeClassName(type) {
  return type.type.name.charAt(0).toUpperCase() + type.type.name.slice(1);
}


// Add an event listener for the search input
const searchInput = document.getElementById("search-input");
searchInput.addEventListener("input", function () {
  createPokemonCards().then((pokemonData) => {
      renderPokemonCards(pokemonData);
      const sortSelect = document.getElementById("sort-select");
      const selectedOption = sortSelect.value;
      updateSortedPokemonCards(selectedOption);
  });
});

function sortPokemonData(pokemonData, sortOption) {
  const sortedData = [...pokemonData];

  switch (sortOption) {
      case "id-asc":
          sortedData.sort((a, b) => a.id - b.id);
          break;
      case "id-desc":
          sortedData.sort((a, b) => b.id - a.id);
          break;
      case "type":
          sortedData.sort((a, b) =>
              a.types[0].type.name.localeCompare(b.types[0].type.name)
          );
          break;
      case "hp":
          sortedData.sort((a, b) => b.hp - a.hp); // Sort by HP in descending order
          break;
      case "attack":
          sortedData.sort((a, b) => b.attack - a.attack); // Sort by Attack in descending order
          break;
      case "name":
          sortedData.sort((a, b) => a.name.localeCompare(b.name));
          break;
      default:
          break;
  }

  return sortedData;
}

// Function to update the Pokémon cards based on the selected sorting option
function updateSortedPokemonCards(sortOption) {
  createPokemonCards().then((pokemonData) => {
      const sortedData = sortPokemonData(pokemonData, sortOption);
      renderPokemonCards(sortedData);
  });
}

// Add an event listener for the sorting select element
const sortSelect = document.getElementById("sort-select");
sortSelect.addEventListener("change", function () {
  const selectedOption = sortSelect.value;
  updateSortedPokemonCards(selectedOption);
});

createPokemonCards(); // Initial call to display all Pokémon

function flipCard(card) {
    card.classList.toggle('flipped');
  }