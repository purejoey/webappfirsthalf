"use strict";

window.addEventListener("DOMContentLoaded",
    function() {
        if (typeof localStorage === "undefined") {
            Swal.fire({
                title: "Memo app", html: "このブラウザはlocal Storage機能が実装されていません。", type: "error", allowOutsideClick: false, imageUrl: "img/error.jpg"
            });
            return;
        } else {
            viewStorage();
            saveLocalStorage();
            delLocalStorage();
            allClearLocalStorage();
            selectTable();

            del_row(); // 行削除
        }
    }, false
);

function saveLocalStorage() {
    const save = document.getElementById("save");
    save.addEventListener("click",
        function(e) {
            e.preventDefault();
            const key = document.getElementById("textKey").value;
            const value = document.getElementById("textMemo").value;

            if (key == "" || value == "") {
                playSound("sound/error.mp3");
                Swal.fire({
                    title: "Memo app", html: "Key、Memoはいずれも必須です。", type: "error", allowOutsideClick: false, imageUrl: "img/error.jpg"
                });
                return;
            } else {
                let w_msg = "LocalStorageに\n「" + key + " " + value + "」\nを保存（save）しますか？";

                playSound("sound/areyousure.mp3");
                Swal.fire({
                    title: "Memo app", html: w_msg, type: "question", showCancelButton: true, imageUrl: "img/areyousure.jpg"
                }).then(function(result) {
                    if (result.value === true) {
                        localStorage.setItem(key, value);
                        viewStorage();
                        let w_msg = "LocalStorageに" + key + " " + value + "を保存（save）しました。";
                        playSound("sound/success.mp3");
                        Swal.fire({
                            title: "Memo app", html: w_msg, type: "success", allowOutsideClick: false, imageUrl: "img/success.jpg"
                        });
                        document.getElementById("textKey").value = "";
                        document.getElementById("textMemo").value = "";
                    }
                });
            }
        }, false
    );
};

function delLocalStorage() {
    const del = document.getElementById("del");
    del.addEventListener("click",
        function(e) {
            e.preventDefault();
            const chkbox1 = document.getElementsByName("chkbox1");
            const table1 = document.getElementById("table1");
            let w_cnt = 0;
            w_cnt = selectCheckBox("del");

            if (w_cnt >= 1) {
                let w_confirm = "LocalStorageから選択されている" + w_cnt + "件を削除（delete）しますか？";

                playSound("sound/areyousure.mp3");
                Swal.fire({
                    title: "Memo app", html: w_confirm, type: "question", showCancelButton: true, imageUrl: "img/areyousure.jpg"
                }).then(function(result) {
                    if (result.value === true) {
                        for (let i=0; i < chkbox1.length; i++) {
                            if (chkbox1[i].checked) {
                                localStorage.removeItem(table1.rows[i+1].cells[1].firstChild.data);
                            }
                        }
                        viewStorage();
                        let w_msg = "LocalStorageから" + w_cnt + "件を削除（delete）しました。";
                        playSound("sound/success.mp3");
                        Swal.fire({
                            title: "Memo app", html: w_msg, type: "success", allowOutsideClick: false, imageUrl: "img/success.jpg"
                        });
                        document.getElementById("textKey").value = "";
                        document.getElementById("textMemo").value = "";
                    }
                });
            }

        }, false
    );

}

function allClearLocalStorage() {
    const allClear = document.getElementById("allClear");
    allClear.addEventListener("click",
        function(e) {
            e.preventDefault();
            let w_confirm = "LocalStorageのデータを全て削除（all clear）します。\nよろしいですか。";

            playSound("sound/areyousure.mp3");
            Swal.fire({
                title: "Memo app", html: w_confirm, type: "question", showCancelButton: true, imageUrl: "img/areyousure.jpg"
            }).then(function(result) {
                if (result.value === true) {
                    localStorage.clear();
                    viewStorage();
                    let w_msg = "のデータを全て削除（all clear）しました。";
                    playSound("sound/success.mp3");
                    Swal.fire({
                        title: "Memo app", html: w_msg, type: "success", allowOutsideClick: false, imageUrl: "img/success.jpg"
                    });
                    document.getElementById("textKey").value = "";
                    document.getElementById("textMemo").value = "";
                    }
            });
        }, false
    );
}

function selectTable() {
    const select = document.getElementById("select");
    select.addEventListener("click",
        function(e) {
            e.preventDefault();
            selectCheckBox("select");
        }, false
    );
}

function selectRadioBtn() {
    let w_sel = "0";
    const radio1 = document.getElementsByName("radio1");
    const table1 = document.getElementById("table1");

    for (let i=0; i < radio1.length; i++) {
        if (radio1[i].checked) {
            document.getElementById("textKey").value = table1.rows[i+1].cells[1].firstChild.data;
            document.getElementById("textMemo").value = table1.rows[i+1].cells[2].firstChild.data;
            return w_sel = "1";
        }
    }
    playSound("sound/error.mp3");
    Swal.fire({
        title: "Memo app", html: "一つ選択（select）してください。", type: "error", allowOutsideClick: false, imageUrl: "img/error.jpg"
    });
}

function selectCheckBox(mode) {
    let w_cnt = 0;
    const chkbox1 = document.getElementsByName("chkbox1");
    const table1 = document.getElementById("table1");
    let w_textKey = "";
    let w_textMemo = "";

    for (let i=0; i < chkbox1.length; i++) {
        if (chkbox1[i].checked) {
            if (w_cnt === 0) {
                w_textKey = table1.rows[i+1].cells[1].firstChild.data;
                w_textMemo = table1.rows[i+1].cells[2].firstChild.data;
            }
            w_cnt++;
        }
    }

// teacher's version
//    document.getElementById("textKey").value = w_textKey;
//    document.getElementById("textMemo").value = w_textMemo;

    if (mode === "select") {
        if (w_cnt === 1) {
// my version
            document.getElementById("textKey").value = w_textKey;
            document.getElementById("textMemo").value = w_textMemo;
            return w_cnt;
        } else {
            playSound("sound/error.mp3");
            Swal.fire({
                title: "Memo app", html: "一つ選択（select）してください。", type: "error", allowOutsideClick: false, imageUrl: "img/error.jpg"
            });
        }
    } else if (mode === "del") {
        if (w_cnt >= 1) {
            return w_cnt;
        } else {
            playSound("sound/error.mp3");
            Swal.fire({
                title: "Memo app", html: "一つ以上選択（select）してください。", type: "error", allowOutsideClick: false, imageUrl: "img/error.jpg"
            });
        }

    }


}

function viewStorage() {
    const list = document.getElementById("list");
    while (list.rows[0]) {
        list.deleteRow(0);
    }

    for (let i=0; i < localStorage.length; i++) {
        let w_key = localStorage.key(i);

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

        td1.innerHTML = "<input name='chkbox1' type='checkbox'>";
        td2.innerHTML = w_key;
        td3.innerHTML = localStorage.getItem(w_key);
        td4.innerHTML = "<img src='img/trash_icon.png' class='trash'>";
    }

    $("#table1").tablesorter({
        sortList: [[1, 0]]
    });

    $("#table1").trigger("update");
}

function del_row() {
    const table1 = document.getElementById("table1");
    table1.addEventListener("click", (e) => {  // eはイベントの対象要素…変数なので、名前はなんでもよい。
        if(e.target.classList.contains("trash") === true){
            e.preventDefault();
            const table1 = document.getElementById("table1");
            let tr = e.target.parentNode.parentNode;
            const keyDel = table1.rows[tr.sectionRowIndex+1].cells[1].firstChild.data;
            const memoDel = table1.rows[tr.sectionRowIndex+1].cells[2].firstChild.data;

            let w_confirm = "LocalStorageから「" + keyDel + " " + memoDel + "」を削除しますか？";

            playSound("sound/areyousure.mp3");
            Swal.fire({
                title: "Memo app", html: w_confirm, type: "question", showCancelButton: true, imageUrl: "img/areyousure.jpg"
            }).then(function(result) {
                if (result.value === true) {
                    localStorage.removeItem(table1.rows[tr.sectionRowIndex+1].cells[1].firstChild.data);
                    viewStorage();

                    let w_msg = "LocalStorageから" + keyDel + " " + memoDel + "を削除（delete）しました。";
                    playSound("sound/success.mp3");
                    Swal.fire({
                        title: "Memo app", html: w_msg, type: "success", allowOutsideClick: false, imageUrl: "img/success.jpg"
                    });

                }
            });
        }
    });
}

function playSound(w_sound) {
    let music = new Audio(w_sound);
    music.currentTime = 0;
    music.play();
}
