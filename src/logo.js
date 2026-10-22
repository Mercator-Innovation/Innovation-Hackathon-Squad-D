// Select the logo and it wobbles. Selecting again restarts the wobble.
(function () {
  const button = document.getElementById("logo-button");
  button.addEventListener("click", () => {
    button.classList.remove("wobble");
    void button.offsetWidth; // lets the animation start again
    button.classList.add("wobble");
  });
  button.addEventListener("animationend", () => button.classList.remove("wobble"));
})();
