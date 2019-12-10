var burgerIcon = document.querySelector(".dropbtn");
var expandedMenu = document.querySelector(".dropdown-content");

function openCloseMenu(e) {
  if (burgerIcon.contains(e.target)) {
    burgerIcon.classList.toggle("change");
    expandedMenu.classList.toggle("show");
    return;
  }
  else {
    if (expandedMenu.classList.contains("show")) {
    burgerIcon.classList.remove("change");
    expandedMenu.classList.remove("show");
    return;
  }
    else {
      return;
  }
}
}
     
window.addEventListener("click", openCloseMenu);