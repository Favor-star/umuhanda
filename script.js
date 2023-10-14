const navButton = document.querySelector(".menu-icon");
const navigationbar = document.querySelector(".bar-elements");
const navigation = document.querySelector(".navigation");
const navContainer = document.querySelector("[nav-container");


navButton.addEventListener("click", () => {
  navigationbar.style.display =
    navigationbar.style.display == "flex" ? "none" : "flex";
});
start.addEventListener("click", () => {
  navigationbar.style.display = "none";
});
