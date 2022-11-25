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
let soundEndflag = "0";


// ボタンを"初期"状態とする
setButtonStateInitial();

window.addEventListener("DOMContentLoaded",
  function() {
    viewScore();
  }, false
);
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
    setButtonStateStopped();
    clearTimeout(timeoutid);
    stopTime = Date.now() - startTime;

    let justTime = "00:10.000";
    let justTime_m = Number(justTime.substring(0, 2));
    let justTime_s = Number(justTime.substring(3, 5));
    let justTime_ms = Number(justTime.substring(6, 9));

    let stopTime_m = Number(timer.textContent.substring(0, 2));
    let stopTime_s = Number(timer.textContent.substring(3, 5));
    let stopTime_ms = Number(timer.textContent.substring(6, 9));

    let diff_m = 0;
    let diff_s = 0;
    let diff_ms = 0;

    if (timer.textContent >= justTime) {
      diff_ms = stopTime_ms - justTime_ms;
      if (stopTime_s >= justTime_s) {
        diff_s = stopTime_s - justTime_s;
      } else {
        stopTime_m -= 1;
        diff_s = 60 - justTime_s;
      }
      diff_m = stopTime_m - justTime_ms;
    } else {
        if (justTime_ms > stopTime_ms) {
          diff_ms = justTime_ms - stopTime_ms;
        } else {
          justTime_s -= 1;
          diff_ms = 1000 - stopTime_ms;
        }
        diff_s = justTime_s - stopTime_s;
        diff_m = 0;
    }

    let diff_time = String(diff_m).padStart(2, "0") + ":" + String(diff_s).padStart(2, "0") + "." + String(diff_ms).padStart(3, "0");
    console.log(diff_time);

    let top5_flg = "0";
    const tablescore = document.getElementById("tablescore");
    let w_tablescore_len = tablescore.rows.length;
    if (w_tablescore_len < 6) {
      top5_flg = "1";
      Swal.fire({
        title: "TOP5★Congratulations!!",
        html: "名前を入力してください。",
        input: "text",
        inputPlaceholder: "input your name!"
      }).then(function(result) {
        if (result.value === "") {
          result.value = "no name";
        }
        saveScore(result.value, diff_time);
        viewScore();
      });
    } else {
      for (let j=1; j < w_tablescore_len; j++) {
        if (tablescore.rows[j].cells[3].firstChild.data > diff_time) {
          top5_flg = "1";
          Swal.fire({
            title: "TOP5★Congratulations!!",
            html: "名前を入力してください。",
            input: "text",
            inputPlaceholder: "input your name!"
          }).then(function(result) {
            if (result.value === "") {
              result.value = "no name";
            }
            saveScore(result.value, diff_time);
            viewScore();
          });
          break;
        }
      }
    }

    if (soundEndflag === "1") {
      soundControl("end", "");
    }
    if (top5_flg === "1") {
      document.body.style.backgroundSize = "cover";
      document.body.style.backgroundPosition = "center center";
      document.body.style.backgroundColor = "transparent";
  
      soundControl("start", "sound/stop2.mp3");
      const fireworks = document.getElementsByTagName("body");
      fireworks[0].style.backgroundImage = "url('img/fireworks.gif')";
      fireworks[0].style.backgroundColor = "rgba(0, 0, 0, 0)";
    } else {
      soundControl("start", "sound/stop1.mp3");
    }
    soundEndflag = "1";
/*
    if (timer.textContent.substring(0, 5) === "00:10") {
      audio_win.src = "./sound/stop2.mp3";
      audio_win.play();
    } else {
      audio_stop.src = "./sound/stop1.mp3";
      audio_stop.play();
    }
    setButtonStateStopped();
    clearTimeout(timeoutid); //setTimeout()でセットしたタイマーを解除する際に使用
    stopTime = Date.now() - startTime;
*/
  },false
);


////////////////////////
// Resetボタンクリック
////////////////////////
reset.addEventListener("click",
  function() {
    if (soundEndflag === "1") {
      soundControl("end", "");
    }
    soundControl("start", "sound/reset.mp3");
    soundEndflag = "1";
    setButtonStateInitial();
    timer.textContent = "00:00.000";
    stopTime = 0;
    const fireworks = document.getElementsByTagName("body");
    fireworks[0].style.backgroundImage = "";
    fireworks[0].style.backgroundColor = "rgba(233, 168, 227, 0.6)";
/*
    // ボタンを"初期"状態とする
    audio_reset.src = "./sound/reset.mp3";
    audio_reset.play();
    setButtonStateInitial();
    timer.textContent = "00:00.000";
    stopTime = 0;
*/
  }//,false
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

  document.body.style.backgroundColor = "rgba(233, 168, 227, 0.6)";
  document.body.style.backgroundSize = "0 0";
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
/*
  //  if (timer.textContent === "00:10.000") {
  if (timer.textContent.substring(0, 5) === "00:10") {
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center center";
    document.body.style.backgroundColor = "transparent";
  }
*/
}

let w_sound
let music
function soundControl(status, w_sound) {
  if (status === "start") {
    music = new Audio(w_sound);
    music.currentTime = 0;
    music.play();
  } else if (status === "end") {
    music.pause();
    music.currentTime = 0;
  }
}

function viewScore() {
  const list = document.getElementById("list");
  while (list.rows[0]) {
    list.deleteRow(0);
  }
  let arr_ranking = [];

  for (let i=0; i < localStorage.length; i++) {
    let w_key = localStorage.key(i);

    if (w_key === "timeguess") {
      let jsonObj = JSON.parse(localStorage.getItem(w_key));

      for (let i=0; i < Object.keys(jsonObj).length; i++) {
        arr_ranking.push([jsonObj[i][0], jsonObj[i][1], jsonObj[i][2], jsonObj[i][3]]);
      }

      for (let j=0; j < arr_ranking.length; j++) {
        let tr = document.createElement("tr");
        let td1 = document.createElement("td");
        let td2 = document.createElement("td");
        let td3 = document.createElement("td");
        let td4 = document.createElement("td");
        list.appendChild(tr);
        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);

        td1.innerHTML = arr_ranking[j][0];
        td2.innerHTML = arr_ranking[j][1];
        td3.innerHTML = arr_ranking[j][2];
        td4.innerHTML = arr_ranking[j][3];
      }
      break;
    }
  }
}

function saveScore(input_name, diff_time) {
  let exited_flg = "0";
  for (let i=0; i < localStorage.length; i++) {
    let w_key = localStorage.key(i);

    if (w_key === "timeguess") {
      exited_flg = "1";
      let jsonObj = JSON.parse(localStorage.getItem(w_key));

      let arr_ranking = [];
      for (let i=0; i < Object.keys(jsonObj).length; i++) {
        arr_ranking.push([jsonObj[i][0], jsonObj[i][1], jsonObj[i][2], jsonObj[i][3]]);
      }
      arr_ranking.push([0, input_name, timer.textContent, diff_time]);

      arr_ranking.sort(function(first, second) {
        if (first[3] > second[3]) {
          return 1;
        }
        if (first[3] < second[3]) {
          return -1;
        }
        return 0;
      });

      for (let i=0; i < arr_ranking.length; i++) {
        if (i < 5) {
          arr_ranking[i][0] = i+1;
        } else {
          arr_ranking.splice(i, 1);
        }
      }

      let obj = arr_ranking;
      jsonObj = JSON.stringify(obj);
      localStorage.setItem("timeguess", jsonObj);

      break;
    }
  }

  if (exited_flg === "0") {
    let arr_ranking = [];
    arr_ranking.push([1, input_name, timer.textContent, diff_time]);
    let obj = arr_ranking;
    let jsonObj = JSON.stringify(obj);
    localStorage.setItem("timeguess", jsonObj);
  }
};

function isSmartPhone() {
  if (navigator.userAgentData && navigator.userAgentData.mobile) {
    return true;
  } else {
    return false;
  }
}  
