let menu = document.querySelector("#menu-icon");
let navList = document.querySelector(".navList");

menu.onclick = () => {
  menu.classList.toggle("bx-x");
  navList.classList.toggle("open");
};

const sr = ScrollReveal({
  distance: "65px",
  duration: 2600,
  delay: 450,
  repeat: true,
});

sr.reveal(".hero-text", { delay: 50, origin: "top" });
sr.reveal(".hero-img", { delay: 500, origin: "top" });
sr.reveal(".icons", { delay: 600, origin: "left" });
sr.reveal(".scroll-down", { delay: 500, origin: "right" });
