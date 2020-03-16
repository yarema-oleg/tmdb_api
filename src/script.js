document.head.insertAdjacentHTML("afterbegin", `<title>TMDb API</title>`);
document.body.insertAdjacentHTML("afterbegin", `<div id="app"></div>`);
document.getElementById("app").innerHTML = `<table width=600><tr><td>
<input type="textbox" id="search_text" onfocusin='if (document.getElementById("search_text").value == "Movie name") {
        document.getElementById("search_text").value= "";
        document.getElementById("search_text").style = "color:#000000";}' 
onfocusout='if (document.getElementById("search_text").value == "") {
        document.getElementById("search_text").style = "color:#696969";
        document.getElementById("search_text").value = "Movie name";}' 
onkeypress='if(event.key == "Enter")  search_button.onclick();' 
style="color:#696969" value="Movie name">
<input type="button" value="Search" id="search_button">
<div id="view_field"></div></td></tr></table>`;

function openfilm() {
  let id = Number(this.id.split("_")[1]);
  search_request.open(
    "GET",
    `https://api.themoviedb.org/3/${
      movies_data.results[id].hasOwnProperty("title") ? "movie" : "tv"
    }/${
      movies_data.results[id].id
    }/recommendations?api_key=937d7a8b8c85f0c5c48884c67acfb7d4&language=en-US&page=1`
  );
  let poster =
    movies_data.results[id].poster_path != null
      ? `<img src="https://image.tmdb.org/t/p/w400${
          movies_data.results[id].poster_path
        }">`
      : "";
  document.getElementById("view_field").innerHTML = `${poster}
  <h2>${
    movies_data.results[id].hasOwnProperty("title")
      ? movies_data.results[id].title
      : movies_data.results[id].name
  }</h2>
  ${movies_data.results[id].overview}`;
  document
    .getElementById("view_field")
    .insertAdjacentHTML("beforeend", `<h4>Recommendations</h4>`);
  quantity = 3;
  search_request.send();
}

let movies_data;
let quantity = 20;
let search_request = new XMLHttpRequest();
search_request.responseType = "json";

document.getElementById("search_button").onclick = function() {
  document.getElementById("view_field").innerHTML = ``;
  if (
    (document.getElementById("search_text").value == "") |
    (document.getElementById("search_text").value == "Movie name")
  ) {
    search_request.open(
      "GET",
      "https://api.themoviedb.org/3/trending/all/day?api_key=937d7a8b8c85f0c5c48884c67acfb7d4"
    );
  } else {
    search_request.open(
      "GET",
      `https://api.themoviedb.org/3/search/movie?api_key=937d7a8b8c85f0c5c48884c67acfb7d4&query=${
        document.getElementById("search_text").value
      }&language=en-US&page=1`
    );
  }
  search_request.send();
};

search_request.onload = function() {
  movies_data = search_request.response;
  document
    .getElementById("view_field")
    .insertAdjacentHTML("beforeend", `<ul id="movies_list"></ul>`);
  if (movies_data.results.length == 0) {
    document
      .getElementById("view_field")
      .insertAdjacentText("beforeend", "There are nothing.");
    quantity = 20;
    return;
  }
  for (let k = 0; k < quantity; k++) {
    document
      .getElementById("movies_list")
      .insertAdjacentHTML(
        "afterbegin",
        `<li><a href="#" id="list_${k}">${
          movies_data.results[k].hasOwnProperty("title")
            ? movies_data.results[k].title
            : movies_data.results[k].name
        }</a></li>`
      );
    document.getElementById(`list_${k}`).onclick = openfilm;
    if (movies_data.results[k + 1] == undefined) break;
  }
  quantity = 20;
};

document.getElementById("search_button").onclick();
