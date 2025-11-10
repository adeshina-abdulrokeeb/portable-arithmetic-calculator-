const display = document.getElementById("display");
const keys = document.getElementById("keys");
const historyDiv = document.getElementById("history");
const themeBtn = document.getElementById("themeBtn");
const calculatorContainer = document.getElementById("calculator-container");
const intro = document.getElementById("intro");

let history = [];

// Theme Setup
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "light") { document.body.classList.add("light"); themeBtn.textContent = "☀️"; }
else { document.body.classList.remove("light"); themeBtn.textContent = "🌙"; }

themeBtn.addEventListener("click", () => {
  const isLight = document.body.classList.toggle("light");
  themeBtn.textContent = isLight ? "☀️" : "🌙";
  localStorage.setItem("theme", isLight ? "light" : "dark");
});

// Intro preloader logic
window.addEventListener("load", () => {
  setTimeout(() => {
    intro.style.opacity = "0";
    intro.addEventListener("transitionend", () => {
      intro.style.display = "none";
      calculatorContainer.classList.add("fade-in");
    }, { once: true });
  }, 2000);
});

// Calculator logic
keys.addEventListener("click", (e) => {
  const btn = e.target;
  const value = btn.dataset.value;
  const action = btn.dataset.action;
  if (!btn.matches("button")) return;

  if (value) addInput(value);
  if (action === "clear") clearDisplay();
  if (action === "backspace") backspace();
  if (action === "calculate") calculate();
});

function addInput(value) {
  const lastChar = display.value.slice(-1);
  if ("+-*/".includes(lastChar) && "+-*/".includes(value)) return;
  display.value += value;
}
function clearDisplay() { display.value = ""; }
function backspace() { display.value = display.value.slice(0, -1); }

function calculate() {
  try {
    const result = eval(display.value);
    if (isNaN(result)) throw new Error();
    history.unshift(`${display.value} = ${result}`);
    history = history.slice(0, 3);
    updateHistory();
    display.value = result;

    display.classList.remove("animate");
    void display.offsetWidth;
    display.classList.add("animate");
  } catch { display.value = "Error"; }
}

function updateHistory() {
  historyDiv.innerHTML = history.map(h => `<div>${h}</div>`).join("");
  historyDiv.querySelectorAll("div").forEach((h, i) => {
    h.addEventListener("click", () => { display.value = history[i].split(" = ")[0]; });
  });
}

// Keyboard support
document.addEventListener("keydown", (e) => {
  if ((e.key >= "0" && e.key <= "9") || "+-*/.".includes(e.key)) addInput(e.key);
  else if (e.key === "Enter") { e.preventDefault(); calculate(); }
  else if (e.key === "Backspace") backspace();
  else if (e.key === "Escape") clearDisplay();
});