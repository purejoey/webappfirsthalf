"use strict";


const timer = document.getElementById("timer");
const start = document.getElementById("start");
const stop = document.getElementById("stop");
const reset = document.getElementById("reset");

const audio_start = document.getElementById("audio-start");
const audio_stop = document.getElementById("audio-stop");
const audio_reset = document.getElementById("audio-reset");
const audio_win = document.getElementById("audio-win");

let startTime;       // Startボタンクリック時の時刻
let timeoutid;       // ID
let stopTime = 0;    // Stopまでの経過時間


// ボタンを"初期"状態とする
setButtonStateInitial();

////////////////////////
// Startボタンクリック
////////////////////////
start.addEventListener("click",
  function() {
    // ボタンをタイマー"動作中"状態とする
    audio_start.src = "./sound/start.mp3";
    audio_start.play();
    setButtonStateRunning();
    startTime = Date.now();
    countUp();
  },false
);

////////////////////////
// Stopボタンクリック
////////////////////////
stop.addEventListener("click",
  function() {
    // タイマーを"停止中"状態とする
    audio_stop.src = "./sound/stop1.mp3";
    audio_stop.play();
    setButtonStateStopped();
    clearTimeout(timeoutid); //setTimeout()でセットしたタイマーを解除する際に使用
    stopTime = Date.now() - startTime;
  },false
);


////////////////////////
// Resetボタンクリック
////////////////////////
reset.addEventListener("click",
  function() {
    // ボタンを"初期"状態とする
    audio_reset.src = "./sound/reset.mp3";
    audio_reset.play();
    setButtonStateInitial();
    timer.textContent = "00:00.000";
    stopTime = 0;
  },false
);


function countUp() {
  const d = new Date(Date.now() - startTime + stopTime);
  /* padStart()で２桁固定表示とする */
  const m = String(d.getMinutes()).padStart(2, "0");
  const s = String(d.getSeconds()).padStart(2, "0");
  const ms = String(d.getMilliseconds()).padStart(3, "0");
  /* 描画 */
  timer.textContent = `${m}:${s}.${ms}`;
//  timer.textContent = "00:10.010";

  timeoutid = setTimeout(() => {
    //再帰呼び出し
    countUp();
  }, 10);
}

// 初期 または Reset後
function setButtonStateInitial() {
  start.classList.remove("js-inactive");
  stop.classList.add("js-inactive");
  reset.classList.add("js-inactive");
  start.classList.remove("js-unclickable");
  stop.classList.add("js-unclickable");
  reset.classList.add("js-unclickable");

  document.body.style.backgroundImage = 'none';
}

// 状態:タイマー動作中
function setButtonStateRunning() {
  timer.classList.add("timer-fontColor_hidden"); //時間を見えなくする
  start.classList.add("js-inactive");   // 非活性
  stop.classList.remove("js-inactive");  // 活性
  reset.classList.add("js-inactive");   // 非活性
  start.classList.add("js-unclickable");
  stop.classList.remove("js-unclickable");
  reset.classList.add("js-unclickable");
}

// 状態:タイマー停止中
function setButtonStateStopped() {
  timer.classList.remove("timer-fontColor_hidden"); //時間を見えるようにする
  timer.classList.add(".timer_appear"); //時間をゆっくり表示
  start.classList.add("js-inactive"); // 活性
  stop.classList.add("js-inactive");    // 非活性
  reset.classList.remove("js-inactive"); // 活性
  start.classList.add("js-unclickable");
  stop.classList.add("js-unclickable");
  reset.classList.remove("js-unclickable");

//  if (timer.textContent === "00:10.000") {
  if (timer.textContent.substring(0, 5) === "00:10") {
      document.body.style.backgroundImage = "url(./img/fireworks.gif)";
    document.body.style.backgroundRepeat = "no-repeat";
    if (isSmartPhone()) {
      document.body.style.backgroundPosition = "75% 0%";
      document.body.style.backgroundSize = "auto 100%";
    } else {
      document.body.style.backgroundSize = "100% 100%";
    }
    audio_win.src = "./sound/stop2.mp3";
    audio_win.play();
  }

  function isSmartPhone() {
    if (navigator.userAgentData && navigator.userAgentData.mobile) {
      return true;
    } else {
      return false;
    }
  }  
}