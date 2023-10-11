///////////// DOM ELEMENTS //////////////
const body = document.querySelector("body");
const main = document.querySelector("#main");
// const btnSort = document.querySelector("#media-select");
const btnSort = document.querySelector(".sort")
const sectionCardsMedia = document.querySelector(".result-medias");
const lightbox = document.querySelector("#lightbox");
const btnClose = document.querySelector(".btn-close-lightbox");
const btnPrev = document.querySelector(".btn-previous");
const btnNext = document.querySelector(".btn-next");
let isClicked = false;
/////TEST SORT FROM SCRATCH//////////
const sortType = document.querySelector(".type");
const sortOptions = document.querySelector(".dropdown .options");
const sortLists = document.querySelectorAll(".dropdown .options h4");
// console.log(sortLists);
const arrowUp = document.querySelector(".fa-chevron-up");
const arrowDown = document.querySelector(".fa-chevron-down");

function hideArrowUp() {
  arrowUp.style.display = "none";
  arrowDown.style.display = "block";
  sortOptions.style.display = "none";
}
function hideArrowDown() {
  arrowUp.style.display = "block";
  arrowDown.style.display = "none";
  sortOptions.style.display = "flex";
}

//////////////ASYNC FUNCTION POUR RECUPERE LES DATAS DU PHOTOGRAPHE ET SES MEDIAS//////////
async function getData(photographersJson, mediaJson) {
  try {
    const id = getId();

    const photographerFound = photographersJson.find(
      (photographer) => photographer.id === id
    );
    // if (!photographerFound) location.href = "/Front-End-Fisheye/index.html";
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
    // location.href = "/Front-End-Fisheye/index.html";
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
  lightbox.setAttribute("aria-labelledby", "lightbox");
  lightbox.setAttribute(
    "aria-description",
    "lightbox pour afficher le média en plein écran"
  );

  //3. désactiver le contenu arrière avec aria-hidden=true, et style overflow=hidden
  body.style.overflow = "hidden";
  main.setAttribute("aria-hidden", "true");
  
  //focus sur le btn close
  //TODO: pas d'effet ?
  btnClose.focus({ focusVisible: true });
}
function closeLightbox() {
  lightbox.style.display = "none";
  lightbox.removeAttribute("role");
  lightbox.setAttribute("aria-hidden", "true");
  lightbox.removeAttribute("aria-labelledby");
  lightbox.removeAttribute("aria-description");

  body.style.overflow = "auto";
  main.removeAttribute("aria-hidden");
}

function goToPrevMedia(dataMedias) {
  let prevIndex;
  const target = document.querySelector(".lightbox-media");

  const idMedia = Number(target.dataset.id);
  //TODO: if idMedia = NaN?
  const indexFound = findIndexEL(dataMedias, idMedia);

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
  //   displayNewMediaInLightbox("next", indexFound, dataMedias);

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
  console.log(dataMedias);

  linkLightbox.forEach((link) => {
    link.addEventListener("click", function (e) {
      const target = e.target.closest(".link-lightbox");
      const idMedia = Number(target.dataset.id);

      const mediaFound = findMediaEL(dataMedias, idMedia);
      console.log("media found", mediaFound);

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
      }

      if (!mediaFound.isLiked) {
        likes++;
        dataPhotographer.sumOfLikes++;
        mediaFound.likes = likes;
      }
      mediaFound.isLiked = !mediaFound.isLiked;
      num.textContent = mediaFound.likes;
      //changer le icon coeur adapté
      mediaPreview.checkIsLiked();
      //update le total des likes
      displaySumLikes(dataPhotographer);
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
sortType.addEventListener("click", (e) => {
    // console.log(e.target);
    if(!e.target) return;
  if (!isClicked) {
    hideArrowDown();
    // sortOptions.style.display = "flex";
  } else {
    hideArrowUp();
    // sortOptions.style.display = "none";
  }
  isClicked = !isClicked;
});
// window.addEventListener("click", (e)=>{
window.addEventListener("click", e => {
    const optionsIsOpened = sortOptions.style.display;
    // console.log(e.target);
    // console.log(optionsIsOpened);
    if (optionsIsOpened === "none") return;
    //TODO: hide options sorting when clicking outside
    // if (optionsIsOpened === "flex" ) console.log("click");
})
// })
function addEventHandlerSort(dataMedias, dataPhotographer) {
  sortLists.forEach((li) => {
    li.addEventListener("click", (e) => {
        console.log(li);
        // if (!e.target) sortOptions.style.display = "none";
      const textType = sortType.querySelector(".type h4");
      const type = li.textContent.toLowerCase();

      //1.remplacer sort type = type (pop, date, titre )
      textType.textContent = li.textContent;
      if (type === "popularité") sortByPopularity(dataMedias);
      if (type === "date") sortByDate(dataMedias);
      if (type === "titre") sortByTitle(dataMedias);

      //2.update les médias en ordre
      sectionCardsMedia.innerHTML = "";
      displayDataMedialEl(dataMedias);
      addEventHandlerLike(dataMedias, dataPhotographer);
      addEventHandlerOpenLightbox(dataMedias);
      //3.fermer sortOptions

      sortOptions.style.display = "none";
      hideArrowUp();
      isClicked = false;
    });
  });
}
// function addEventHandlerSort(dataMedias, dataPhotographer) {

//   btnSort.addEventListener("change", function toSort() {
//     if (!btnSort.value) return;
//     if (btnSort.value === "popularite") sortByPopularity(dataMedias);
//     if (btnSort.value === "date") {
//       //classer en ordre décroissante
//       dataMedias.sort((media1, media2) => {
//         media1 = new Date(media1.date);
//         media2 = new Date(media2.date);

//         if (media1 > media2) return -1;
//         if (media1 < media2) return 1;
//         return 0;
//       });
//     }
//     if (btnSort.value === "titre") {
//       //classer en ordre croissante
//       dataMedias.sort((media1, media2) => {
//         media1 = media1.title.toLowerCase();
//         media2 = media2.title.toLowerCase();

//         if (media1 > media2) return 1;
//         if (media1 < media2) return -1;
//         return 0;
//       });
//     }
//     sectionCardsMedia.innerHTML = "";
//     displayDataMedialEl(dataMedias);
//     addEventHandlerLike(dataMedias, dataPhotographer);
//     addEventHandlerOpenLightbox(dataMedias);
//     // addEventHandlerCloseLightbox()
//     return dataMedias;
//   });

//   return dataMedias, dataPhotographer;
// }

/////////////////INITIALISER L'APP//////////////////
async function init() {
  try {
    // const photographersJson = await getPhotographers(
    //   "/Front-End-Fisheye/data/photographers.json"
    // );
    const photographersJson = await getPhotographers(
      "data/photographers.json"
    );
    // const mediaJson = await getMedia(
    //   "/Front-End-Fisheye/data/photographers.json"
    // );
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
    // btnSort.focus();

    // getInfoPhotographerForForm(photographerFound)
    //events handler
    // addEventHandlerSort(mediaFound, photographerFound);
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
