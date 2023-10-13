async function getQuestion() {
  const data = await fetch("./questions.json");
  const response = await data.json();
  return response.qList1;
}

//declarations
const question = document.querySelector(".question");
const optionsDiv = document.querySelector(".options");
const prevBtn = document.querySelectorAll(".progress-btn")[0];
const nextBtn = document.querySelectorAll(".progress-btn")[1];
const qNumber = document.querySelector("[q-number]");
const secondsDiv = document.querySelector(".seconds");
const minutesDiv = document.querySelector(".minutes");
const imageDiv = document.querySelector(".q-image");
const container = document.querySelector(".container");
const start = document.querySelector(".start");
let selectedOption = [];
let selectedQuestionIndex = [];

getQuestion().then((list) => {
  let listLength = list.length;
  let index = 0;

  const render = (index) => {
    index == 0
      ? prevBtn.setAttribute("class", "prev-btn ")
      : prevBtn.removeAttribute("class", "prev-btn");
    prevBtn.classList.add("progress-btn");
    nextBtn.style.backgroundColor =
      index == listLength - 1 ? "#ff0000" : "#0a69ed";
    nextBtn.innerHTML = index == listLength - 1 ? "Submit" : "Next";
    qNumber.innerHTML = index + 1;
    question.innerHTML = list[index].question;
    // Clear existing options
    optionsDiv.innerHTML = "";
    //map the option in p elements
    list[index].options.map((option) => {
      let p = document.createElement("p");
      p.innerText = option;
      p.setAttribute("class", "choices");

      // Check if this option was selected previously
      selectedOption.map((obj) => {
        if (obj.qIndex === index && obj.answer === option) {
          p.classList.add("clickedDiv");
        }
      });
      if (selectedOption.includes(option)) {
        p.classList.add("clickedDiv");
      }
      optionsDiv.appendChild(p);
    });
    let pElements = document.querySelectorAll("p");
    pElements.forEach((elem) => {
      const chosenAnswer = elem.innerHTML;
      elem.addEventListener("click", () => {
        const existingEntryIndex = selectedOption.findIndex(
          (entry) => entry.qIndex === index
        );

        if (existingEntryIndex !== -1) {
          // Update the existing entry
          selectedOption[existingEntryIndex].answer = chosenAnswer;
        } else {
          // Add a new entry
          selectedOption.push({ qIndex: index, answer: chosenAnswer });
        }
        console.log(selectedOption);
        elem.classList.add("clickedDiv");

        pElements.forEach((otherPElement) => {
          if (otherPElement !== elem) {
            otherPElement.classList.remove("clickedDiv");
            selectedOption = selectedOption.filter((element) => {
              return element.chosenAnswer !== otherPElement.innerText;
            });
          }
        });
      });
    });
  };

  render(0);

  nextBtn.addEventListener("click", () => {
    index = (index + 1) % listLength;
    render(index);
  });

  prevBtn.addEventListener("click", () => {
    index = (index - 1 + listLength) % listLength;
    render(index);
  });
});

start.addEventListener("click", atStart);

function atStart() {
  start.style.display = "none";
  container.classList.add("container-shown");
}
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    atStart();
  }
});
