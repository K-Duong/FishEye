// DOM elements
const modal = document.getElementById("contact_modal");
const form = document.querySelector("form");
const inputs = document.querySelectorAll("form input");
const inpFName = document.querySelector("#first-name");
const inpLName = document.querySelector("#last-name");
const inpMail = document.querySelector("#email");
const message = document.querySelector("#message");

const displayModal = () => {
  initForm();
  modal.style.display = "flex";
  inpFName.focus();

  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-hidden", "false");
  modal.setAttribute("aria-labelledby", "modal");
  modal.setAttribute(
    "aria-description",
    "formulaire de contact au photographe"
  );

  //désactiver le contenu arrière 
  body.style.overflow = "hidden";
  header.setAttribute("aria-hidden", "true");
  main.setAttribute("aria-hidden", "true");
}

const closeModal = () => {
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
const displayError = (elDom, message) => {
  const inputEl = document.querySelector(elDom);
  inputEl.style.display = "block";
  inputEl.innerHTML= message
}

const closeError = (elDom) => {
  const inputEl = document.querySelector(elDom);
  inputEl.style.display = "none";
}

//function vérifier la validation des inputs
const checkInputValid = (inp, condition, pError, message) => {
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

const getCondition = (input, regexFormat) => {
  const val = input.value.trim();
  return val.length > 0 && val.match(regexFormat) ? true : false;
}
const checkFNameValid = () => {
  const nameFormat = /^[a-zA-Z- ]*$/;
  const condition = getCondition(inpFName, nameFormat);
  return checkInputValid(inpFName, condition, ".err-fname","Veuillez entrer votre prénom avec au moins une lettre.");
}
const checkLNameValid = () => {
  const nameFormat = /^[a-zA-Z- ]*$/;
  const condition = getCondition(inpLName, nameFormat);
  return checkInputValid(inpLName, condition, ".err-lname","Veuillez entrer entrer votre nom avec au moins une lettre.");
}
const checkMailValid = () => {
  const mailFormat = /[a-z0-9-._]+@[a-z0-9-_]+.[a-z]{2,4}/;
  const condition = getCondition(inpMail, mailFormat);
  return checkInputValid(inpMail, condition,".err-email", "Email doit être sous forme abc@xyz.com");
}

//check 1: events listener, quand l'utilisateur saisit une valeur 
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

//fermer la modale avec Escape
window.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (e.key === "Escape") {
        if (modal.style.display = "none") return;
        if (modal.style.display = "flex") closeModal();
    }
})

//reset form
const initForm = () => {
    form.reset();
    const messagesError = document.querySelectorAll('form div p');
    inputs.forEach(inp=>inp.classList.remove("input-error"));
    messagesError.forEach(mes => mes.style.display="none")
}
initForm();
