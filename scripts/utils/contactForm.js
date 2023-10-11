// DOM elements
const modal = document.getElementById("contact_modal");
const form = document.querySelector("form");
const inputs = document.querySelectorAll("form input");
const inpFName = document.querySelector("#first-name");
const inpLName = document.querySelector("#last-name");
const inpMail = document.querySelector("#email");
const message = document.querySelector("#message");

function displayModal() {
  modal.style.display = "flex";
  inpFName.focus();
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-hidden", "false");
  modal.setAttribute("aria-labelledby", "modal");
  modal.setAttribute(
    "aria-description",
    "formulaire de contact au photographe"
  );

  //3. désactiver le contenu arrière avec aria-hidden=true, et style overflow=hidden
  main.setAttribute("aria-hidden", "true");
  body.style.overflow = "hidden";
}

function closeModal() {
  modal.style.display = "none";
  form.reset();

  modal.removeAttribute("role");
  modal.setAttribute("aria-hidden", "true");
  modal.removeAttribute("aria-labelledby");
  modal.removeAttribute("aria-description");

  main.removeAttribute("aria-hidden");
  body.style.overflow = "auto";
}

//function vérifier la validation des inputs
function checkInputValid(inp, condition) {
  if (condition) {
    inp.classList.remove("input-error");
    return true;
  } else {
    inp.classList.add("input-error");
    return false;
  }
}

function getCondition(input, regexFormat) {
  const val = input.value.trim();
  return val.length > 0 && val.match(regexFormat) ? true : false;
}
function checkNameValid(inp) {
  const nameFormat = /^[a-zA-Z- ]*$/;
  const condition = getCondition(inp, nameFormat);
  return checkInputValid(inp, condition);
}
function checkMailValid() {
  const mailFormat = /[a-z0-9-._]+@[a-z0-9-_]+.[a-z]{2,4}/;
  const condition = getCondition(inpMail, mailFormat);
  return checkInputValid(inpMail, condition);
}
/////Events handler/////
//check 1: quand l'utilisateur saisi une donnée
const forName = [inpFName, inpLName];
forName.forEach((el) => {
  el.addEventListener("change", () => {
    checkNameValid(el);
  });
});
inpMail.addEventListener("change", () => {
  checkMailValid();
});
//check 2: quand l'utilisateur submit form
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const inputs = [
    checkNameValid(inpFName),
    checkNameValid(inpLName),
    checkMailValid(),
  ];
  // console.log(inputs);
  const allValid = inputs.every((inp) => inp);
  if (allValid) {
    console.log("Données du form:");
    console.log(`Prénom : ${inpFName.value}`);
    console.log(`Nom : ${inpLName.value}`);
    console.log(`Email: ${inpMail.value}`);
    console.log(`Message: ${message.value}`);

    form.reset();
    closeModal();
  } else {
    console.log("formulaire n'est pas terminé !");
  }
});

window.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (e.key === "Escape") {
        if (modal.style.display = "none") return;
        if (modal.style.display = "flex") closeModal();
    }
})
