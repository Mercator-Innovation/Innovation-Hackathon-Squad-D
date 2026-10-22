// Select the logo and it wobbles, then spins round 3 times. Selecting again starts it over.
(function () {
  const button = document.getElementById("logo-button");
  button.addEventListener("click", () => {
    button.classList.remove("wobble");
    void button.offsetWidth; // lets the animation start again
    button.classList.add("wobble");
  });
  // Wait for the spin, the last of the two animations, before tidying up
  button.addEventListener("animationend", (e) => { if (e.animationName === "logo-spin") button.classList.remove("wobble"); });
})();
