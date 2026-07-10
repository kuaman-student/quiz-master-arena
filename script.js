

// Easily updatable answer key


const defaultAnswerKey = [
  '', 'b', 'c', 'c', 'c', 'd', 'a', 'c', 'c', 'c', 'a',
  'd', 'c', 'a', 'd', 'a', 'c', 'd', 'a', 'c', 'd',
  'c', 'a', 'b', 'd', 'c', 'b', 'c', 'c', 'b', 'c',
  'a', 'c', 'd', 'a', 'c', 'b', 'd', 'b', 'c', 'c',
  'a', 'c', 'c', 'a', 'd', 'b', 'a', 'c', 'b', 'c',
  'b', 'c', 'c', 'd', 'b', 'a', 'c', 'd', 'a', 'c',
  'c', 'd', 'c', 'd', 'a', 'a', 'b', 'b', 'a', 'd',
  'd', 'c', 'a', 'a', 'b', 'c', 'a', 'a', 'a', 'c',
  'c', 'a', 'b', 'c', 'd', 'd', 'b', 'd', 'c', 'c',
  'c', 'd', 'a', 'c', 'c', 'c', 'c', 'b'
];

let answerKey =
JSON.parse(localStorage.getItem("answerKey")) || defaultAnswerKey;
let timerInterval = null;

const totalQuestions = answerKey.length - 1;

document.getElementById("questionNumber").focus();
  
  
  let correct = 0;
  let incorrect = 0;
  let streak = 0;
  let answers = [];
  let attemptedQuestions = new Set();
  
  const correctSound = document.getElementById("correctSound");
  const wrongSound = document.getElementById("wrongSound");
  const celebrateSound = document.getElementById("celebrateSound");
  const alarmSound = document.getElementById("alarmSound");
  
  function submitAnswer() {
    const qNum = parseInt(document.getElementById("questionNumber").value);
    const ans = document
.getElementById("userAnswer")
.value
.trim()
.toLowerCase();
document.getElementById("userAnswer").value = ans.toUpperCase();
document.getElementById("questionNumber").focus();
    const resultDisplay = document.getElementById("resultDisplay");
  
    if (isNaN(qNum) || qNum < 1 || qNum >= answerKey.length || !['a','b','c','d'].includes(ans)) {
      resultDisplay.textContent = `❗ Enter valid question and answer (a/b/c/d)`;
      resultDisplay.className = '';
      return;
    }
  
    if (attemptedQuestions.has(qNum)) {
      resultDisplay.textContent = `⚠️ You already attempted Q${qNum}`;
      resultDisplay.className = 'result-text incorrect';
      return;
    }
  
    const correctAnswer = answerKey[qNum];
    const isCorrect = ans === correctAnswer;
  
    answers.push({ question: qNum, yourAnswer: ans, correctAnswer, isCorrect });
    attemptedQuestions.add(qNum);
  
    if (isCorrect) {
      correct++;
      streak++;
      correctSound.play();
      resultDisplay.textContent = `✅ Correct!`;
      resultDisplay.className = 'result-text correct';
      showStreakPopup(streak);
    } else {
      incorrect++;
      streak = 0;
      wrongSound.play();
      resultDisplay.textContent = `❌ Incorrect! Correct: ${correctAnswer}`;
      resultDisplay.className = 'result-text incorrect';
    }
  
    document.getElementById("correct").textContent = correct;
    document.getElementById("incorrect").textContent = incorrect;
    document.getElementById("questionNumber").value = '';
    document.getElementById("userAnswer").value = '';
  }
  
function showStreakPopup(streak){

    switch(streak){

        case 3:

            alert("🔥 3 Correct in a Row!");

            break;

        case 5:

            alert("⚡ 5 Correct in a Row!");

            break;

        case 10:

            celebrateSound.play();

            alert("🏆 10 Correct! Amazing!");

            break;

        case 20:

            celebrateSound.play();

            alert("👑 20 Streak! You're unstoppable!");

            break;

    }

}
  
  function startTimer(){

    const seconds=parseInt(document.getElementById("timerInput").value);

    const display=document.getElementById("timerDisplay");

    if(isNaN(seconds)||seconds<=0){

        alert("Enter valid time.");

        return;

    }

    if(timerInterval){

        clearInterval(timerInterval);

    }

    let remaining=seconds;

    display.textContent=`⏳ ${remaining}s`;

    timerInterval=setInterval(()=>{

        remaining--;

        display.textContent=`⏳ ${remaining}s`;

        if(remaining<=0){

            clearInterval(timerInterval);

            timerInterval=null;

            display.textContent="⏰ Time's Up";

            alarmSound.play();

            alert("Time's Up!");

        }

    },1000);

}
  
function finishQuiz(){

    if(correct+incorrect===0){

        alert("No questions attempted.");

        return;

    }

    const attempted=correct+incorrect;

    const score=correct*4-incorrect;

    const totalQuestions = answerKey.length - 1;


    const percentage=((correct/totalQuestions)*100).toFixed(2);

    const accuracy=((correct/attempted)*100).toFixed(2);

    localStorage.setItem("quizResults",JSON.stringify({

        correct,

        incorrect,

        attempted,

        score,

        percentage,

        accuracy,

        totalQuestions,

        answers

    }));

    window.location.href="result.html";

}
  


function editAnswerKey() {

    let current = answerKey.slice(1).join("");

    let input = prompt(
`Enter answer key as one continuous string.

Example:
bcccdacccadcad...

Only use a, b, c, d

Current key:

${current}`
);

    if (!input) return;

    input = input.toLowerCase().replace(/\s/g,'');

    if(!/^[abcd]+$/.test(input)){

    alert("Only a, b, c and d allowed.");

    return;

}

if(input.length<=1){

    alert("Answer key too short.");

    return;

}

    let newKey = [''];

    for(let ch of input){
        newKey.push(ch);
    }

    answerKey = newKey;

    localStorage.setItem(
        "answerKey",
        JSON.stringify(answerKey)
    );

    alert("✅ Answer key updated successfully.");
}


function resetAnswerKey(){

    if(!confirm("Restore default answer key?")) return;

    localStorage.removeItem("answerKey");

    answerKey=defaultAnswerKey;

    alert("Default answer key restored.");

}



document.getElementById("questionNumber").addEventListener("keypress",e=>{
    if(e.key==="Enter"){
        document.getElementById("userAnswer").focus();
    }
});

document.getElementById("userAnswer").addEventListener("keypress",e=>{
    if(e.key==="Enter"){
        submitAnswer();
    }
});