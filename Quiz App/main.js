// select elements
let countSpan = document.querySelector(".quiz-info .count span");
let bulletsSpanContainer = document.querySelector(".bullets .spans");
let quizArea = document.querySelector(".quiz-area");
let answersArea = document.querySelector(".answers-area");
let submitButton = document.querySelector(".submit-button");
let bullets = document.querySelector(".bullets");
let theResultsContainer = document.querySelector(".results");
let countdownElement = document.querySelector(".countdown");

// Set Options
let currentIndex = 0;
let rightAnswers = 0;
let coundownInterval;

function getQuestions() {
  let myRequest = new XMLHttpRequest();

  myRequest.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let questionObject = JSON.parse(this.responseText);
      let qCount = questionObject.length;
      console.log(qCount);

      // Create Bullets + Set Questions Count
      createBullets(qCount);

      // Add Question Data
      addQuestionData(questionObject[currentIndex], qCount);

      // Start Countdown
      countdown(40, qCount);

      // Click on submit
      submitButton.onclick = () => {
        // Get right answer
        let theRightAnswer = questionObject[currentIndex].right_answer;

        // Increase Index
        currentIndex++;

        // Check answer
        checkAnswer(theRightAnswer, qCount);

        // Remove Previous Question
        quizArea.innerHTML = "";
        answersArea.innerHTML = "";

        // Add Question data
        addQuestionData(questionObject[currentIndex], qCount);

        // Handle Bullets Class
        handleBullets();

        // Start Countdown
        clearInterval(coundownInterval);
        countdown(40, qCount);

        // Show Results
        showResults(qCount);
      };
    }
  };

  myRequest.open("GET", "html_questions.json", true);
  myRequest.send();
}

getQuestions();

function createBullets(num) {
  countSpan.innerHTML = num;

  // Create spans
  for (let i = 0; i < num; i++) {
    // Create Span
    let theBullet = document.createElement("span");

    // Check if its first span
    if (i == 0) {
      theBullet.className = "on";
    }

    // Append Bullets to main bullet container
    bulletsSpanContainer.appendChild(theBullet);
  }
}

// 5
// 0, 1, 2, 3, 4

function addQuestionData(obj, count) {
  if (currentIndex < count) {
    // Create H2 question title
    let questionTitle = document.createElement("h2");

    // Create Question Text
    let questionText = document.createTextNode(obj.title);

    // Append text to h2
    questionTitle.appendChild(questionText);

    // Append h2 to the quiz area
    quizArea.appendChild(questionTitle);

    // Create the answers
    for (let i = 1; i <= 4; i++) {
      // Create main answer div
      let mainDiv = document.createElement("div");

      // Add class to main div
      mainDiv.className = "answer";

      // Create radio input
      let radioInput = document.createElement("input");

      // Add type + name + id + Data-Attribute
      radioInput.name = "question";
      radioInput.type = "radio";
      radioInput.id = `answer_${i}`;
      radioInput.dataset.answer = obj[`answer_${i}`];

      // Make first option selected

      // Create Label
      let theLabel = document.createElement("label");

      // Add for attribute
      theLabel.htmlFor = `answer_${i}`;

      // Create label text
      let theLabelText = document.createTextNode(obj[`answer_${i}`]);

      // Add the text to label
      theLabel.appendChild(theLabelText);

      // Add input + Label to main div
      mainDiv.appendChild(radioInput);
      mainDiv.appendChild(theLabel);

      // Append all divs to answers area
      answersArea.appendChild(mainDiv);
    }
  }
}

function checkAnswer(rAnswer, count) {
  let answers = document.getElementsByName("question");

  let theChosenAnswer;

  for (let i = 0; i < answers.length; i++) {
    if (answers[i].checked) {
      theChosenAnswer = answers[i].dataset.answer;
    }
  }

  if (rAnswer === theChosenAnswer) {
    rightAnswers++;
    console.log("Good answer");
  }
}

function handleBullets() {
  let bulletsSpans = document.querySelectorAll(".bullets .spans span");
  let arraySpans = Array.from(bulletsSpans);
  arraySpans.forEach((span, index) => {
    if (currentIndex === index) {
      span.className = "on";
    }
  });
}

function showResults(count) {
  let theResults;
  if (currentIndex === count) {
    quizArea.remove();
    answersArea.remove();
    submitButton.remove();
    bullets.remove();

    if (rightAnswers > count / 2 && rightAnswers < count) {
      theResults = `<span class="good">Good</span>, ${rightAnswers} From ${count} is Good.`;
    } else if (rightAnswers === count) {
      theResults = `<span class="perfect">Perfect</span>, ${rightAnswers} From ${count} is Perfect.`;
    } else {
      theResults = `<span class="bad">Bad</span>, ${rightAnswers} From ${count} is Bad.`;
    }

    theResultsContainer.innerHTML = theResults;
    theResultsContainer.style.padding = "10px";
    theResultsContainer.style.backgroundColor = "white";
  }
}

function countdown(duration, count) {
  if (currentIndex < count) {
    let minutes, seconds;
    coundownInterval = setInterval(function () {
      minutes = parseInt(duration / 60);
      seconds = parseInt(duration % 60);

      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;

      countdownElement.innerHTML = `${minutes}:${seconds}`;

      if (--duration < 0) {
        clearInterval(coundownInterval);
        submitButton.click();
      }
    }, 1000);
  }
}
