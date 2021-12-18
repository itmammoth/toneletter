// example 1

new Toneletter(document.getElementById("example1"), { lang: "th" }).observe();

// example 2

const toneletter2 = new Toneletter(document.getElementById("example2"), {
  lang: "th",
});
toneletter2.observe();
const offButton = document.getElementById("off");
offButton.addEventListener("click", () => toneletter2.off());

// example 3

const toneletter3 = new Toneletter(document.getElementById("example3"), {
  lang: "th",
});
const addToneButtons = document.getElementsByClassName("add-tone");
for (let i = 0; i < addToneButtons.length; i++) {
  addToneButtons[i].addEventListener("click", () => toneletter3.addTone(i));
}

// example 4

new Toneletter(document.getElementById("example4"), {
  lang: "th",
  toneKeys: ["0", "1", "2", "3", "4"],
  phoneticSymbols: {
    U: "\u0289",
    A: "\u0259",
    E: "\u025b",
    "@": "\u0254",
    G: "\u014b",
  },
}).observe();

// exmaple 5

new Toneletter(document.getElementById("example5"), { lang: "cn" }).observe();
