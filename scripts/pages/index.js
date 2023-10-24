const displayData = (photographers) => {
  const photographersSection = document.querySelector(".photographer_section");

  photographers.forEach((photographer) => {
    const photographerModel = photographerTemplate(photographer);
    const userCardDOM = photographerModel.getUserCardDOM();
    photographersSection.appendChild(userCardDOM);
  });
}

const initPageIndex = async () => {
  try {
    const photographers = await getPhotographers(
      "data/photographers.json"
    );
    console.log(photographers);
    displayData(photographers);

  } catch (err) {
    console.error(err);
  }
}
initPageIndex();


