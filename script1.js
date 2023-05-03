
let url = "http://localhost:8000/api/v1/" 
function MainUrl(url, functionUrl) {
  
  
    fetch(url) 
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Request failed. Returned status of ' + response.status);
        }
      })
      .then(data => functionUrl(data))
      .catch(error => console.error(error));
      console.log(functionUrl)
  }
  

        /* 
        ƒ bestMovieUrlFunc(result) {  
    console.log(result) ;
    bestMovieUrl = result.results[0].url;  
    MainUrl(bestMovieUrl, bestMovieResultMainPage);
  }
        
        
        
                                                      */    

  
  //Display the best movie and its description on a web page and a modal
  let bestMovieUrlList = "http://localhost:8000/api/v1/titles/?sort_by=-votes,-imdb_score";
  let bestMovieUrl;
  function bestMovieUrlFunc(result) {  
    console.log(result) ;
    bestMovieUrl = result.results[0].url;  
    MainUrl(bestMovieUrl, bestMovieResultMainPage);
  }
  function bestMovieResultMainPage(result){
    document.getElementById("best_film_img").innerHTML = "<img src=" + result.image_url + "alt='Best Film Image' height='400' width='300'/>";
    document.getElementById("best_film_title").innerHTML = result.original_title;
    document.getElementById("best_film_description").innerHTML = result.description;
  }
  MainUrl(bestMovieUrlList, bestMovieUrlFunc);
  let btn = document.getElementById("best_film_btn_info");  
  btn.onclick = function() {
    MainUrl(bestMovieUrl, MovieResultsModale);
    modal.style.display = "block";
  }
  
  //Populate Movie Details in a Modal
  function MovieResultsModale(result){
    document.getElementById("header_modal_film_img").innerHTML = "<img src=" + result.image_url + "alt='Best Film Image' />";
    document.getElementById("header_modal_original_title").innerHTML = result.original_title;
    document.getElementById("info_modal_text_genres").innerHTML = result.genres;
    document.getElementById("info_modal_text_date_published").innerHTML = result.date_published;
    document.getElementById("info_modal_text_rated").innerHTML = result.rated;
    document.getElementById("info_modal_text_imdb_score").innerHTML = result.imdb_score;
    document.getElementById("info_modal_director").innerHTML = result.directors;
    document.getElementById("info_modal_actors").innerHTML = result.actors;
    document.getElementById("info_modal_duration").innerHTML = result.duration + ' min';
    document.getElementById("info_modal_countries").innerHTML = result.countries;
    document.getElementById("info_modal_worldwide_gross_income").innerHTML = result.worldwide_gross_income + ' $';
    document.getElementById("info_modal_long_description").innerHTML = result.long_description;
}

//Close Modal When Clicked Outside or on Close Button
let modal = document.getElementById("info_modal");
let span = document.getElementsByClassName("modal_content_close")[0];
span.onclick = function() {
  modal.style.display = "none"; 
}
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

// Function to Generate Movie Category Section with Slideshow
function makeCategory(category){
  let genre = '';
  let idSection;
  let FilmUrlList;
  if (category != "Film les mieux notés"){
    genre = category;
    idSection = genre;
    FilmUrlList = "http://localhost:8000/api/v1/titles/?sort_by=-votes,-imdb_score&genre=" + genre;
    }else{
      FilmUrlList = "http://localhost:8000/api/v1/titles/?sort_by=-votes,-imdb_score";
      idSection = 'bestFilms'
    }
  let section = document.createElement("section");
  let nav = document.createElement("a");
  const resultsImagesUrl = [];
  const resultsLinksUrl = [];
  const picturesSlides = [];
  const urlList = []
  let nbSlide = 0;

     
  
  // Create Movie Category Section Title and Navigation Link          
  nav.setAttribute("href", '#'+ idSection);
  nav.textContent = category;   
  document.getElementById("nav_header").appendChild(nav);
  section.setAttribute("class", "category");
  section.setAttribute("id", idSection);                  
  document.getElementById("main_block").appendChild(section);
  let p = document.createElement("p");
  p.setAttribute("class", "Category__title");
  p.setAttribute("id", idSection + 'Title');
  section.appendChild(p);
  let h1 = document.createElement("h1"); /*   */
  h1.textContent = category; 
  document.getElementById(idSection + 'Title').appendChild(h1);

  //Creating a slider for a category
  let divSlider = document.createElement("div");
  divSlider.setAttribute("id", idSection + "List");
  divSlider.setAttribute("class", "list");
  let spanControlPrev = document.createElement("span");
  let spanControlNext = document.createElement("span");
  spanControlPrev.setAttribute("id", "prev" + idSection);    
  spanControlPrev.setAttribute("class", "category__prev");
  spanControlPrev.textContent = "<";
  spanControlNext.setAttribute("id", "next" + idSection);
  spanControlNext.setAttribute("class", "category__next");
  spanControlNext.textContent = ">";
  divSlider.appendChild(spanControlPrev);

  
  //Creating Slides for Movie Images in Category Section 
  for (let i=1; i<5; i++){
    let spanSlide = document.createElement("span");
    spanSlide.setAttribute("id", "slide" + i + idSection);
    spanSlide.setAttribute("class", "category__slide category__slide" + i);
    divSlider.appendChild(spanSlide);
  }
  section.appendChild(divSlider);
  divSlider.appendChild(spanControlNext);

  //retrieving movie results and setting up slides and controls for switching between slides in a category.

  for (i=1; i<3; i++){
    urlList.push(FilmUrlList + "&page="+ i);
  }
  getUrls(urlList, resultsImagesUrl, resultsLinksUrl, picturesSlides, idSection);
 
  for (let i=1; i<5; i++){
    document.getElementById("slide"+ i + idSection).onclick = function() {
      if (nbSlide + (i-1) !== 7){
        MainUrl(resultsLinksUrl[nbSlide + (i-1)], MovieResultsModale);
      modal.style.display = "block";
      } else {
        MainUrl(resultsLinksUrl[0], MovieResultsModale);
      modal.style.display = "block";                         
      } 
    }
  }
  
  document.getElementById("prev" + idSection).onclick = function() {
    nbSlide = changeSlide(-1, nbSlide)
    displayPictureSlide(idSection, picturesSlides, nbSlide);
  }
  document.getElementById("next" + idSection).onclick = function() {
    nbSlide = changeSlide(+1, nbSlide)
    displayPictureSlide(idSection, picturesSlides, nbSlide);
  }
}


//Function to Update Slide Number and Direction Based on Window Size 
function changeSlide(direction, nbSlide) {
  nbSlide = nbSlide + direction;
  if (window.matchMedia("(max-width: 1280px)").matches) {
    if (nbSlide < 0) {
      nbSlide = 4;
      }
    if (nbSlide > 4) {
      nbSlide = 0;
      }
    } else {
      if (nbSlide < 0) {
        nbSlide = 3;
        }
      if (nbSlide > 3) {
        nbSlide = 0;
    }
  }
  return nbSlide;
}

// Request category movie
async function getUrls(urlList, resultsImagesUrl, resultsLinksUrl, picturesSlides, idSection) { 
  try {
      let data = await Promise.all(
        urlList.map(
              url =>
                  fetch(url).then(
                      (response) => response.json()
                  ).then(
                    function (data) {
                      return data;})
                  )
      );
      for (element of data){
        for (let i = 0; i < 5; i++) {
          resultsImagesUrl.push(element.results[i].image_url);  
          resultsLinksUrl.push(element.results[i].url);  
        }
      }
  
      if (resultsImagesUrl.length > 7) {
        for (let i = 0; i < 7; i++) {
          picturesSlides.push("<img src=" + resultsImagesUrl[i] + "alt='Category Film Image/>");
        }
      }
  } catch (error) {
      console.log(error)
      throw (error)
  }
  displayPictureSlide(idSection, picturesSlides, 0);
  
}

// Displaying Picture Slides and Handling Slide Navigation in a Category
function displayPictureSlide(idSection, picturesSlides, nbSlide){
  for (let i=1; i<5; i++){
    if (nbSlide + (i - 1) !== 7){
    document.getElementById("slide"+ i + idSection).innerHTML = picturesSlides[nbSlide + (i - 1)];
    } else {
      document.getElementById("slide"+ i + idSection).innerHTML = picturesSlides[0];
    }
  }
}

//  Creating Categories and Calling Function for Each Category.
const categories = [
  "Film les mieux notés",
  "Comedy",
  "Action",
  "Drama"
];

for (let category of categories) {
  makeCategory(category);
}
