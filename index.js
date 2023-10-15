async function getQuestion() {
  const data = await fetch("./questions.json");
  const response = await data.json();
  return response.qList1;
}

//declarations
const question = document.querySelector(".question"),
  optionsDiv = document.querySelector(".options"),
  prevBtn = document.querySelectorAll(".progress-btn")[0],
  nextBtn = document.querySelectorAll(".progress-btn")[1],
  qNumber = document.querySelector("[q-number]"),
  qCount = document.querySelector(".q-count"),
  secondsDiv = document.querySelector(".seconds"),
  minutesDiv = document.querySelector(".minutes");
const imageDiv = document.querySelector(".q-image");
const container = document.querySelector(".container");
const start = document.querySelector(".start");
const body = document.querySelector("body");
const toggleDark = document.querySelector(".toggle-mode");
let selectedOption = [];
let selectedQuestionIndex = [];

toggleDark.addEventListener("click", () => {
  body.classList.toggle("dark-mode");
});
getQuestion().then((list) => {
  let listLength = list.length;
  let index = 0;

  const render = (index) => {
    index == 0
      ? prevBtn.setAttribute("class", "prev-btn ")
      : prevBtn.removeAttribute("class", "prev-btn");
    prevBtn.classList.add("progress-btn");
    nextBtn.style.backgroundColor =
      index == listLength - 1 ? "#00aa6c" : "var(--mainColor)";
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
      //Checking if the clicked option exists, if yes replace it with the current clicked option
      elem.addEventListener("click", () => {
        const existingEntryIndex = selectedOption.findIndex(
          (entry) => entry.qIndex === index
        ); //THIS FINDS WHETHER THE INDEX OF QUESTION WHOSE OPTIONS ARE CLICKED EXISTS

        if (existingEntryIndex !== -1) {
          //IF THIS INDEX EXISTS, IF WILL UPDATE THE OBJECT REPRESENTING THE SELECTED OPTION
          selectedOption[existingEntryIndex].answer = chosenAnswer;
        } else {
          // IF NOT, THE NEW ENTRY IS ADDED.
          selectedOption.push({ qIndex: index, answer: chosenAnswer });
        }
        console.log(selectedOption);
        elem.classList.add("clickedDiv");
        pElements.forEach((otherPElement) => {
          if (otherPElement !== elem) {
            otherPElement.classList.remove("clickedDiv");
          }
        });
      });
    });
  };

  render(0);

  nextBtn.addEventListener("click", () => {
    index = index + 1;
    if (index > listLength - 1) {
      handleCorrectAnswer(list, selectedOption);

      return;
    }
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
function handleCorrectAnswer(list, selectedOption) {
  const correctChoices = [];
  let marks = 0;
  for (let i = 0; i < list.length; i++) {
    correctChoices.push(list[i].correct);
  }

  for (let j = 0; j < correctChoices.length; j++) {
    let isAnswerFound = false;
    for (let i = 0; i < selectedOption.length; i++) {
      if (
        selectedOption[i].answer == correctChoices[j] &&
        j == selectedOption[i].qIndex
      ) {
        marks += 1;
        isAnswerFound = true;
        break;
      }
    }
    if (isAnswerFound) {
      continue;
    }
  }
  question.innerHTML = "Marks";
  let p = document.createElement("p");
  p.setAttribute("class", "choices");
  p.innerHTML = marks;
  p.classList.add("marks-shown");
  optionsDiv.innerHTML = "";
  optionsDiv.appendChild(p);
  // nextBtn.style.display = "none";
  nextBtn.innerHTML = "View Answers";
  nextBtn.addEventListener("click", () => {
    console.log("Clicked");
    saveAnswers(list, appendIndex);
  });
  prevBtn.style.display = "none";
  qCount.innerHTML = "Thank you!";

  return marks;
}

//FUNCTION TO HANDLE THE AFTER FINISH
let selection = [];

let appendIndex = 0;
function saveAnswers(list, index) {
  container.innerHTML = "";

  let q = document.createElement("p");
  let span1 = document.createElement("span");
  let span2 = document.createElement("span");
  span1.setAttribute("class", "material-symbols-outlined");
  span2.setAttribute("class", "material-symbols-outlined");
  span1.innerHTML = "keyboard_double_arrow_up";
  span2.innerHTML = "keyboard_double_arrow_down";
  span2.onclick = () => {
    container.innerHTML = "";
    index++;
    append();
  };
  function append() {
    q.innerHTML = list[index].question;
    container.classList.add("answers-container");

    container.appendChild(span1);
    container.appendChild(q);
    list[index].options.forEach((option) => {
      let p = document.createElement("p");
      p.innerHTML = option;
      p.classList.add("answers");
      container.appendChild(p);
    });
    container.appendChild(span2);
    console.log(list[index].question);
  }
  append(list, index);
}
