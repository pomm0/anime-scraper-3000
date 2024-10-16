(async () => {
  let hasNextPage = false;

  const urlSearchParam = new URLSearchParams();
  urlSearchParam.set("page", 1);

  async function fetchData() {
    try {
      const response = await fetch(
        `https://api.jikan.moe/v4/anime?${urlSearchParam.toString()}`
      );
      const { data, pagination } = await response.json();

      hasNextPage = pagination.has_next_page;

      return data;
    } catch (error) {
      alert("error");
    }
  }

  function render(animes, resetView = false) {
    const appContainer = document.getElementById("app");

    if (resetView) {
      appContainer.innerHTML = "";
    }

    animes.forEach((anime) => {
      const cardContainer = document.createElement("div");
      cardContainer.classList.add("card");

      const img = document.createElement("img");
      img.src = anime.images.jpg.image_url;
      cardContainer.appendChild(img);

      const h3 = document.createElement("h3");
      h3.innerText = anime.title;
      cardContainer.appendChild(h3);

      appContainer.appendChild(cardContainer);
    });
  }

  async function onSearch(searchInput) {
    urlSearchParam.set("page", 1);

    if (searchInput.value) {
      urlSearchParam.set("q", searchInput.value);
    } else {
      urlSearchParam.delete("q");
    }

    render(await fetchData(), true);
  }

  function onBottomReached([appBottomContainer]) {
    if (appBottomContainer.isIntersecting) {
      debounce(async () => {
        if (hasNextPage) {
          urlSearchParam.set("page", parseInt(urlSearchParam.get("page")) + 1);

          render(await fetchData());
        }
      });
    }
  }

  let currentSearchDebounceTimeout = null;

  function debounce(debounceFunction, timeInMilliseconds = 500) {
    if (currentSearchDebounceTimeout) {
      clearTimeout(currentSearchDebounceTimeout);
    }

    currentSearchDebounceTimeout = setTimeout(() => {
      currentSearchDebounceTimeout = null;
      debounceFunction();
    }, timeInMilliseconds);
  }

  const searchInput = document.getElementById("search");
  searchInput.addEventListener("input", async () => {
    debounce(() => onSearch(searchInput));
  });

  const observer = new IntersectionObserver(onBottomReached);
  const target = document.getElementById("app-bottom");
  observer.observe(target);

  render(await fetchData());
})();
