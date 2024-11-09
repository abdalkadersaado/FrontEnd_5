document.querySelectorAll(".triggerButton").forEach(OpenMenu);
// Responsive Js Coding Created By Shift Media Solutions| SMS
// Menu Open and Close function
function OpenMenu(active) {
  if (active.classList.contains("triggerButton") === true) {
    active.addEventListener("click", function (e) {
      e.preventDefault();

      if (this.nextElementSibling.classList.contains("active") === true) {
        // Close the clicked dropdown
        this.parentElement.classList.remove("active");
        this.nextElementSibling.classList.remove("active");
      } else {
        // Close the opend dropdown
        closeMenu();
        // add the open and active class(Opening the DropDown)
        this.parentElement.classList.add("active");
        this.nextElementSibling.classList.add("active");
      }
    });
  }
}

// Listen to the doc click
window.addEventListener("click", function (e) {
  // Close the menu if click happen outside menu
  if (e.target.closest(".radial") === null) {
    // Close the opend dropdown
    closeMenu();
  }
});

// Responsive Js Coding Created By Shift Media Solutions| SMS
// Close the openend Menu
function closeMenu() {
  // remove the open and active class from other opened Moenu (Closing the opend Menu)
  document.querySelectorAll(".radial").forEach(function (container) {
    container.classList.remove("active");
  });

  document.querySelectorAll(".radialMenu").forEach(function (menu) {
    menu.classList.remove("active");
  });
}
