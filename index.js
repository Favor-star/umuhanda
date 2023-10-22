async function getQuestion() {
  const data = await fetch("./questions.json");
  const response = await data.json();
  const responseArray = Object.entries(response);
  const q = `qList${Math.floor(Math.random() * responseArray.length + 1)}`;
  console.log(q);
  return response[q];
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
const refresh = document.querySelector(".refresh");
let selectedOption = [];
let selectedQuestionIndex = [];
let appendIndex = 0;

//TOGGLE THE BACKGROUND MODE
const toggleColorMode = () => {
  body.classList.toggle("dark-mode");
};
toggleDark.addEventListener("click", toggleColorMode);
// Check system color scheme preference and set initial mode
if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
  toggleColorMode(); // Set dark mode if system prefers it
}
//REFRESH THE WEBPAGE
refresh.addEventListener("click", () => {
  location.reload();
});
getQuestion().then((list) => {
  let listLength = list.length;
  let index = 0;

  //SHOWING QUESTION TO THE USER
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
    //HANDLING THE DISPLAY OF IMAGE. IF THE QUESTION CONTAINS IMAGES, SHOW IT; ELSE THE IMAGE DIV IS NOT DISPLAYED
    if (list[index].qImgLink === "N/A") {
      imageDiv.style.display = "none";
    } else {
      imageDiv.innerHTML = "";
      let image = document.createElement("img");
      image.src = `${list[index].qImgLink}`;
      image.alt = `image-id-${list[index].id}`;
      image.classList.add("image-shown");
      imageDiv.appendChild(image);
      imageDiv.style.display = "block";
    }
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
      handleMarks(list, selectedOption);

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

//FUNCTION TO HANDLE THE INITIAL RENDERING OF PAGE ON RELOAD
function atStart() {
  start.style.display = "none";
  container.classList.add("container-shown");
}
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    atStart();
  }
});

//FUNCTION TO CALCULATE THE TOTAL MARKS OBTAINED
function handleMarks(list, selectedOption) {
  const correctChoices = [];
  let marks = 0;
  for (let i = 0; i < list.length; i++) {
    // extract the correct choices from the provided lists and stores them in correctChoices array
    correctChoices.push(list[i].correct);
  }

  for (let j = 0; j < correctChoices.length; j++) {
    // loop over all correctChoicesArray
    let isAnswerFound = false;
    for (let i = 0; i < selectedOption.length; i++) {
      //looping througn the selected options and compares the correct and selescted
      if (
        selectedOption[i].answer == correctChoices[j] &&
        j == selectedOption[i].qIndex
      ) {
        marks += 1;
        isAnswerFound = true;
        break;
        //checks the question number and its answer and compare them to the correct choices. if found to match, add a mark, and leave the loop without further due.
      }
    }
    if (isAnswerFound) {
      //if the answer was found in this loop, continue to the next iteration.
      continue;
    }
  }
  //SHOWIMG MARKS, UPDATING BUTTONS, CALLING THE FUNCTION WHICH HANDLE THE REVIEWING.
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

//FUNCTION WHICH ALLOW THE USER TO BE ABLE TO SEE HIS CHOICES AND REVIEW  THE CORRECT ONES
function saveAnswers(list, index) {
  container.innerHTML = "";

  let q = document.createElement("p");
  let span1 = document.createElement("span");
  let span2 = document.createElement("span");
  span1.setAttribute("class", "material-symbols-outlined reviewBtn"); //create the up button
  span2.setAttribute("class", "material-symbols-outlined reviewBtn");
  span1.innerHTML = "keyboard_double_arrow_up"; //set the inner text for up button
  span2.innerHTML = "keyboard_double_arrow_down"; //set the inner text for down button
  span1.setAttribute("title", "Click to show Previous Question"); //set the title so that when the mouse stays on the element the user will be able to see the usage
  span2.setAttribute("title", "Click to show Next Question");
  span1.onclick = () => {
    //handle the clicking of the up button
    container.innerHTML = "";
    index--;
    append();
  };

  span2.onclick = () => {
    container.innerHTML = "";
    index++;
    append();
  };

  function append() {
    //this is responsible for showing the the question
    q.innerHTML = list[index].question;
    q.classList.add("question");
    container.classList.add("answers-container");

    container.appendChild(span1);
    container.appendChild(q);

    list[index].options.forEach((option) => {
      let p = document.createElement("p");
      p.innerText = option;
      p.classList.add("answers");
      container.appendChild(p);
    });
    container.appendChild(span2);
    const object = selectedOption[index];
    const selected = list[index].options.filter((elem) => {
      if (object == undefined) {
        console.log("No selection were made!");
        return;
      }
      return elem === selectedOption[index].answer;
    });
    const pElem = document.querySelectorAll(".answers");
    console.log(pElem);
    pElem.forEach((elem) => {
      //it checks whether the choices is equal to the answer, if so, it add the  highlight showing that it correct
      elem.innerHTML === list[index].correct &&
        elem.classList.add("clickedDiv");

      //checks if the choices was made, but if it is differrent from the real answer and then it adds the red color
      elem.innerHTML == selected[0] &&
        !elem.classList.contains("clickedDiv") &&
        elem.classList.add("notTrue");
    });
  }
  append(); //call the function at first;
}
