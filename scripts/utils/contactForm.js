// DOM elements
const modal = document.getElementById("contact_modal");
const form = document.querySelector("form");
const inputs = document.querySelectorAll("form input");
const inpFName = document.querySelector("#first-name");
const inpLName = document.querySelector("#last-name");
const inpMail = document.querySelector("#email");
const message = document.querySelector("#message");

function displayModal() {
  init();
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
  body.style.overflow = "hidden";
  header.setAttribute("aria-hidden", "true");
  main.setAttribute("aria-hidden", "true");
}

function closeModal() {
  modal.style.display = "none";
  form.reset();

  modal.removeAttribute("role");
  modal.setAttribute("aria-hidden", "true");
  modal.removeAttribute("aria-labelledby");
  modal.removeAttribute("aria-description");

  body.style.overflow = "auto";
  header.removeAttribute("aria-hidden");
  main.removeAttribute("aria-hidden");
};

//afficher le message d'erreur pour les inputs invalid
function displayError(elDom, message){
  const inputEl = document.querySelector(elDom);
  ///1.display block message d'erreur
  inputEl.style.display = "block";
  ///2.afficher le contenu du message
  inputEl.innerHTML= message
}
function closeError(elDom){
  const inputEl = document.querySelector(elDom);
  inputEl.style.display = "none";
}
//function vérifier la validation des inputs
function checkInputValid(inp, condition, pError, message) {
  if (condition) {
    inp.classList.remove("input-error");
    closeError(pError);
    return true;
  } else {
    inp.classList.add("input-error");
    displayError(pError, message)
    return false;
  }
}

function getCondition(input, regexFormat) {
  const val = input.value.trim();
  return val.length > 0 && val.match(regexFormat) ? true : false;
}
function checkFNameValid() {
  const nameFormat = /^[a-zA-Z- ]*$/;
  const condition = getCondition(inpFName, nameFormat);
  return checkInputValid(inpFName, condition, ".err-fname","Veuillez entrer votre prénom avec au moins une lettre.");
}
function checkLNameValid() {
  const nameFormat = /^[a-zA-Z- ]*$/;
  const condition = getCondition(inpLName, nameFormat);
  return checkInputValid(inpLName, condition, ".err-lname","Veuillez entrer entrer votre nom avec au moins une lettre.");
}
function checkMailValid() {
  const mailFormat = /[a-z0-9-._]+@[a-z0-9-_]+.[a-z]{2,4}/;
  const condition = getCondition(inpMail, mailFormat);
  return checkInputValid(inpMail, condition,".err-email", "Email doit être sous forme abc@xyz.com");
}

inpFName.addEventListener("change", () => {
  checkFNameValid();
});
inpLName.addEventListener("change", () => {
  checkLNameValid();
});
inpMail.addEventListener("change", () => {
  checkMailValid();
});
//check 2: quand l'utilisateur submit form
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const inputs = [
    checkFNameValid(),
    checkLNameValid(),
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

//reset form
function init() {
    form.reset();
    const messagesError = document.querySelectorAll('form div p');
    inputs.forEach(inp=>inp.classList.remove("input-error"));
    messagesError.forEach(mes => mes.style.display="none")
}
init();
