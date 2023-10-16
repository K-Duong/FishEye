///////////// DOM ELEMENTS //////////////
const body = document.querySelector("body");
const main = document.querySelector("#main");
const header = document.querySelector("header");
const btnSort = document.querySelector(".dropdown")
const sectionCardsMedia = document.querySelector(".result-medias");
const lightbox = document.querySelector("#lightbox");
const btnClose = document.querySelector(".btn-close-lightbox");
const btnPrev = document.querySelector(".btn-previous");
const btnNext = document.querySelector(".btn-next");
const dropdownToggle = document.querySelector("button.dropdown-toggle");
const dropdownMenu = document.querySelector(".sort .options");
const sortLists = document.querySelectorAll(".sort .options button");
const dropdownMenuItems = Array.from(dropdownMenu.children);
const arrowUp = document.querySelector(".fa-chevron-up");
const arrowDown = document.querySelector(".fa-chevron-down");

let isClicked = false;

function closeDropdownMenu() {
  arrowUp.style.display = "none";
  arrowDown.style.display = "block";
  dropdownMenu.style.display = "none";
  body.style.overflow="auto";
  dropdownToggle.setAttribute("aria-expanded", "false");
}
function openDropdownMenu() {
  arrowUp.style.display = "block";
  arrowDown.style.display = "none";
  dropdownMenu.style.display = "flex";
  body.style.overflow="hidden";
  dropdownToggle.setAttribute("aria-expanded", "true");
}

//////////////ASYNC FUNCTION POUR RECUPERE LES DATAS DU PHOTOGRAPHE ET SES MEDIAS//////////
async function getData(photographersJson, mediaJson) {
  try {
    const id = getId();

    const photographerFound = photographersJson.find(
      (photographer) => photographer.id === id
    );
    if (!photographerFound) location.href = "index.html";

    // chercher les médias du photographe selon son id et retourner en objet du factory
    const mediaFound = mediaJson
      .filter((media) => media.photographerId === id)
      .map((media) => factory(media));

    //calculer la somme des likes des médias du photographe
    const mediaLikes = mediaFound
      .map((media) => media.likes)
      .reduce((acc, current) => acc + current, 0);

    // mettre à jour l'objet du photographe avec la somme des likes des médias
    photographerFound.sumOfLikes = mediaLikes;

    return { photographerFound, mediaFound };
  } catch (err) {
    console.error(err);
  }
}
//////////////LES FONCTIONS/////////////////
function getId() {
  let urlParams = new URLSearchParams(window.location.search);
  let url = window.location.href;
  //   console.log(urlParams.size > 0);
  if (urlParams.size > 0) {
    const id = Number(urlParams.get("id"));
    return id;
  } else {
    console.error("id not found");
    location.href = "index.html";
  }
}

function displaySumLikes(dataPhotographer) {
  const sumLikeCard = document.querySelector(".sum-likes");
  sumLikeCard.textContent = dataPhotographer.sumOfLikes;
  return;
}

function findMediaEL(dataMedias, idMedia) {
  const mediaFound = dataMedias.find((el) => el.id === idMedia);
  // console.log(mediaFound,indexFound);
  return mediaFound;
}

function findIndexEL(dataMedias, idMedia) {
  const indexFound = dataMedias.findIndex((el) => el.id === idMedia);
  // console.log(mediaFound,indexFound);
  return indexFound;
}

function openLightbox() {
  //1. activer display= flex du lightbox
  lightbox.style.display = "flex";
  //2. ajouter l'attribut role=dialogue in lightbox
  lightbox.setAttribute("role", "dialog");
  lightbox.setAttribute("aria-hidden", "false");
  //FIXME: revoir le role de aria-labelledby
  lightbox.setAttribute("aria-labelledby", "lightbox");
  lightbox.setAttribute(
    "aria-description",
    "lightbox pour afficher le média en plein écran"
  );

  //3. désactiver le contenu arrière avec aria-hidden=true, et style overflow=hidden
  body.style.overflow = "hidden";
  header.setAttribute("aria-hidden", "true");
  main.setAttribute("aria-hidden", "true");
  
  //focus sur le btn close
  btnClose.focus();
}
function closeLightbox() {
  lightbox.style.display = "none";
  lightbox.removeAttribute("role");
  lightbox.setAttribute("aria-hidden", "true");
  lightbox.removeAttribute("aria-labelledby");
  lightbox.removeAttribute("aria-description");

  body.style.overflow = "auto";
  header.removeAttribute("aria-hidden");
  main.removeAttribute("aria-hidden");
}

function goToPrevMedia(dataMedias) {
  let prevIndex;
  const target = document.querySelector(".lightbox-media");

  const idMedia = Number(target.dataset.id);
  //TODO: if idMedia = NaN?
  const indexFound = findIndexEL(dataMedias, idMedia);
  console.log("media found", dataMedias[indexFound].type);


  prevIndex = indexFound - 1;
  if (prevIndex === -1) {
    prevIndex = dataMedias.length - 1;
  }

  const mediaPrev = dataMedias[prevIndex];

  const mediaPreview = mediaTemplate(mediaPrev);
  mediaPreview.addElLightbox();
}

function goToNextMedia(dataMedias) {
  let nextIndex;
  const target = document.querySelector(".lightbox-media");
  const idMedia = Number(target.dataset.id);
  // console.log(idMedia);
  

  const indexFound = findIndexEL(dataMedias, idMedia);
  console.log("media found", dataMedias[indexFound].type);

  nextIndex = indexFound + 1;
  if (nextIndex === dataMedias.length) {
    nextIndex = 0;
  }
  const mediaNext = dataMedias[nextIndex];
  // console.log(mediaNext);

  const mediaPreview = mediaTemplate(mediaNext);
  mediaPreview.addElLightbox();
}

//fonction pour afficher les cartes des médias du photographe
function displayDataMedialEl(dataMedias) {
  //   const mediaContainer = document.querySelector(".result-medias");
  dataMedias.forEach((mediaEl) => {
    const mediaPreview = mediaTemplate(mediaEl);
    sectionCardsMedia.appendChild(mediaPreview.cardMedia());
    mediaPreview.checkIsLiked();
  });
}

//fonction pour afficher les infos du photographer de la carte du photographe et l'encart du total des likes
function displayData(dataPhotographer, dataMedias) {
  const photographer = photographerTemplate(dataPhotographer);
  photographer.cardPhotographer();
  photographer.cardPrice();
  photographer.nameForForm();

  displayDataMedialEl(dataMedias);
  displaySumLikes(dataPhotographer);
}

function playVideo() {
  let isPlayed = false;
  window.addEventListener("keydown", (e) => {
    if (e.key !== " ") return;
    if (e.key === " ") {
      const video = document.querySelector("#lightbox video");
      if (video) {
        if (!isPlayed) {
          isPlayed = true;
          video.play();
        } else {
          video.pause();
          isPlayed = !isPlayed;
        }
      } else {
        return;
      }
    }
  });
}

//////////////// ADD EVENTLISTENERS ////////////////////
//Ouvrir le lightbox
function addEventHandlerOpenLightbox(dataMedias) {
  const linkLightbox = document.querySelectorAll(".link-lightbox");
  // console.log(dataMedias);

  linkLightbox.forEach((link) => {
    link.addEventListener("click", function (e) {
      const target = e.target.closest(".link-lightbox");
      const idMedia = Number(target.dataset.id);

      const mediaFound = findMediaEL(dataMedias, idMedia);
      // console.log("media found", mediaFound);

      const mediaPreview = mediaTemplate(mediaFound);
      mediaPreview.addElLightbox();
      playVideo(mediaFound);

      openLightbox();
    });
  });
}
//Fermer le lightbox
////1.btn close
function addEventHandlerCloseLightbox() {
  btnClose.addEventListener("click", closeLightbox);
}
////2. keydown escape
function addEventHandlerEscape() {
  window.addEventListener("keydown", (e) => {
    if (lightbox.style.display === "none") return;
    if (lightbox.style.display === "flex") {
      if (e.key === "Escape") {
        // console.log(e.key);
        closeLightbox();
      } else {
        return;
      }
    }
  });
}

//Retourner au média précédent
////1.btn précédent
function addEventHandlerPreviousLightBox(dataMedias) {
  btnPrev.addEventListener("click", function () {
    goToPrevMedia(dataMedias);
  });
}
////2.Arrow left
function addEventListenerArrowLeft(dataMedias) {
  window.addEventListener("keydown", function (e) {
    if (lightbox.style.display === "none") return;
    if (lightbox.style.display === "flex") {
      if (e.key === "ArrowLeft") {
        goToPrevMedia(dataMedias);
      } else {
        return;
      }
    }
  });
}

//Aller vers le media suivant
////1.btn suivant
function addEventHandlerNextLightBox(dataMedias) {
  btnNext.addEventListener("click", function (e) {
    goToNextMedia(dataMedias);
  });
}
////2.Arrow right
function addEventListenerArrowRight(dataMedias) {
  window.addEventListener("keydown", function (e) {
    if (lightbox.style.display === "none") return;
    if (lightbox.style.display === "flex") {
      if (e.key === "ArrowRight") {
        goToNextMedia(dataMedias);
      } else {
        return;
      }
    }
  });
}


function addEventHandlerLike(dataMedias, dataPhotographer) {
  const favorites = document.querySelectorAll(".favorite");
  

  favorites.forEach((fav) => {
    const btnHeart = fav.querySelector("button");
    const id = Number(fav.dataset.id);
    const mediaFound = findMediaEL(dataMedias, id);
    const mediaPreview = mediaTemplate(mediaFound);
    let likes = mediaFound.likes;

    fav.addEventListener("click", function increaseLike(e) {
      const target = e.currentTarget;
      const num = target.querySelector(".number");

      //guard clause
      if (!target) return;
      if (mediaFound.isLiked) {
        likes--;
        dataPhotographer.sumOfLikes--;
        mediaFound.likes = likes;
        btnHeart.setAttribute("aria-label", "pas encore aimé");
      }

      if (!mediaFound.isLiked) {
        likes++;
        dataPhotographer.sumOfLikes++;
        mediaFound.likes = likes;
        btnHeart.setAttribute("aria-label", "déjà aimer");
      }
      mediaFound.isLiked = !mediaFound.isLiked;
      num.textContent = mediaFound.likes;
      //changer le icon coeur adapté
      mediaPreview.checkIsLiked();
      //update le total des likes
      displaySumLikes(dataPhotographer);
      console.log(btnHeart);
    });
  });
}

function sortByPopularity(dataMedias) {
  dataMedias.sort((media1, media2) => {
    media1 = media1.likes;
    media2 = media2.likes;

    if (media1 > media2) return -1;
    if (media1 < media2) return 1;
    return 0;
  });
}
function sortByDate(dataMedias) {
  dataMedias.sort((media1, media2) => {
    media1 = new Date(media1.date);
    media2 = new Date(media2.date);

    if (media1 > media2) return -1;
    if (media1 < media2) return 1;
    return 0;
  });
}
function sortByTitle(dataMedias) {
  dataMedias.sort((media1, media2) => {
    media1 = media1.title.toLowerCase();
    media2 = media2.title.toLowerCase();

    if (media1 > media2) return 1;
    if (media1 < media2) return -1;
    return 0;
  });
}

//trier les médias en ordre
let active = -1;
document.addEventListener("keydown", (e) => {
  // const isHidden = dropdownMenuItems[active] ? dropdownMenuItems[active].classList.contains("option--hidden") : 0;
  
  const isOpenedDropdown = dropdownMenu.style.display;
  const length = dropdownMenuItems.length-1;
  // console.log(length);
  if (isOpenedDropdown !== "flex") return;
 
  if (e.key === "ArrowDown") {
    if(active < length) {
      active++;
    } else if(active === length) {
      active = 0;
    }
    // console.log(active);
    dropdownMenuItems[active].focus();
  } else if(e.key === "ArrowUp") {
    if(active > 0) {
      active--;
    } else if (active === 0) {
      active = dropdownMenuItems.length-1;
    }
    dropdownMenuItems[active].focus();
  } else {
    closeDropdownMenu();
  }
  
})
/// trier avec clavier

dropdownToggle.addEventListener("click", (e) => {
    if(!e.target) return;
  if (!isClicked) {
    openDropdownMenu();
  } else {
    closeDropdownMenu();
  }
  isClicked = !isClicked;
});

function addEventHandlerSort(dataMedias, dataPhotographer) {
  sortLists.forEach((li) => {
    li.addEventListener("click", () => {
      const type = li.textContent.trim().toLowerCase();

      //1.remplacer sort type = type (pop, date, titre )
      dropdownToggle.childNodes[0].data = li.textContent;
      if (type === "popularité") sortByPopularity(dataMedias);
      if (type === "date") sortByDate(dataMedias);
      if (type === "titre") sortByTitle(dataMedias);

      //2. retirer l'option depuis la liste des options
      sortLists.forEach((el) => {
        const id = el.id;
        if (el === li) {
          el.classList.remove("option--display");
          el.classList.add("option--hidden");
          el.setAttribute("aria-selected","true");
          dropdownToggle.setAttribute("aria-labelledby", `listboxLabel ${id}`);
          dropdownToggle.setAttribute("aria-activedescendant", `${id}`);
          dropdownToggle.setAttribute("aria-expanded", "true");


        } else {
          el.classList.remove("option--hidden");
          el.classList.add("option--display");
          el.setAttribute("aria-selected","false");
        }
      })
      //3.update les médias en ordre
      sectionCardsMedia.innerHTML = "";
      displayDataMedialEl(dataMedias);
      addEventHandlerLike(dataMedias, dataPhotographer);
      addEventHandlerOpenLightbox(dataMedias);
      
      //4.fermer dropdownMenu
      closeDropdownMenu();
      isClicked = false;
    });
  });
}

// fermer le dropdown options quand utilisateur clique à l'extérieur de dropdown zone
document.addEventListener('click', (e)=>{
  const insideDropdown = e.target.closest(".dropdown");
  if(!insideDropdown && dropdownMenu.style.display === "flex") {
    closeDropdownMenu(); 
    isClicked=false;
  }else{
    return;
  };

})

/////////////////INITIALISER L'APP//////////////////
async function init() {
  try {
    
    const photographersJson = await getPhotographers(
      "data/photographers.json"
    );
   
    const mediaJson = await getMedia(
        "data/photographers.json"
      );

    const { photographerFound, mediaFound } = await getData(
      photographersJson,
      mediaJson
    );
    // média classé par défaut en ordre de leur popularité
    sortByPopularity(mediaFound);
    displayData(photographerFound, mediaFound);

    //events handler
    addEventHandlerSort(mediaFound, photographerFound);
    addEventHandlerLike(mediaFound, photographerFound);
    addEventHandlerOpenLightbox(mediaFound);
    addEventHandlerPreviousLightBox(mediaFound);
    addEventHandlerNextLightBox(mediaFound);
    addEventHandlerCloseLightbox();

    //keyboad events
    addEventListenerArrowLeft(mediaFound);
    addEventListenerArrowRight(mediaFound);
    addEventHandlerEscape();
  } catch (err) {
    console.error(err);
  }
}
init();
