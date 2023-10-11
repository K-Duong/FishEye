function displayData(photographers) {
  const photographersSection = document.querySelector(".photographer_section");

  photographers.forEach((photographer) => {
    const photographerModel = photographerTemplate(photographer);
    const userCardDOM = photographerModel.getUserCardDOM();
    photographersSection.appendChild(userCardDOM);
  });
}

async function init() {
  try {
    // const photographers = await getPhotographers(
    //   "/Front-End-Fisheye/data/photographers.json"
    // );
    const photographers = await getPhotographers(
      "data/photographers.json"
    );
    console.log(photographers);
    displayData(photographers);
    const article = document.querySelector("article");
    console.log("article", article);
    article.focus({ focusVisible: true });
    

  } catch (err) {
    console.error(err);
  }
}
init();

////EventHandler Accessibility///
// window.addEventListener("keydown", (e)=> {
//     console.log(e.key);
//     const key = e.key;

//     // if()             dfqs

// })
