const burgerIcon = document.querySelector(".dropbtn");
const expandedMenu = document.querySelector(".dropdown-content");

const openCloseMenu = (e) => {
  if (burgerIcon.contains(e.target)) {
    burgerIcon.classList.toggle("change");
    expandedMenu.classList.toggle("show");
    return;
  } else {
    if (expandedMenu.classList.contains("show")) {
      burgerIcon.classList.remove("change");
      expandedMenu.classList.remove("show");
      return;
    } else return;
  }
}
     
window.addEventListener("click", openCloseMenu);