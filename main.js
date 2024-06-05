function fetchData() {
  var response = fetch("https://api.jikan.moe/v4/anime");
  return response.json().data;
}

function render(animes) {
  // TODO implement
  console.log(animes)
}

var animes = fetchData();
render(animes);
