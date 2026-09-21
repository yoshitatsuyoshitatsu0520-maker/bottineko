/* =========================================
   ぼっちねこくんのふわふわ広場
   ティーチくん・BGM用JavaScript
========================================= */


/* =========================================
   ティーチくんのセリフ
========================================= */

const teachMessages = [
    {
        text: "やあ、ボクはティーチくんだよ",
        audio: "audio/teach01.wav"
    },
    {
        text: "うーーーーーん、謎☆",
        audio: "audio/teach02.wav"
    },
    {
        text: "ばなな食べたいなー",
        audio: "audio/teach03.wav"
    },
    {
        text: "僕と遊ぼうよ",
        audio: "audio/teach04.wav"
    },
    {
        text: "きやすく触らないでくれるかな？",
        audio: "audio/teach05.wav"
    },
    {
        text: "ふんふんふふーーーん",
        audio: "audio/teach06.wav"
    },
    {
        text: "今日は何するんだい？",
        audio: "audio/teach07.wav"
    },
    {
        text: "……。"
    },
    {
        text: "えへへ。",
        audio: "audio/teach09.wav"
    },
    {
        text: "めっ！",
        audio: "audio/teach10.wav"
    },
    {
        text: "お絵描きするかい？",
        audio: "audio/teach11.wav"
    },
    {
        text: "何見てるんだい？",
        audio: "audio/teach12.wav"
    },
    {
        text: "ねこって、かわいいよね",
        audio: "audio/teach13.wav"
    },
    {
        text: "ﾍｯｸｼｮﾝ!!!!!!!",
        audio: "audio/teach14.wav"
    },
    {
        text: "うおっ！？！？ビックリしたー",
        audio: "audio/teach15.wav"
    },
    {
        text: "なんだいキミ、名乗りたまへ",
        audio: "audio/teach16.wav"
    }
];


/* =========================================
   HTMLの要素を取得
========================================= */

const teachImage = document.getElementById("teachImage");
const teachBubble = document.getElementById("teachBubble");

const bgm = document.getElementById("bgm");
const bgmButton = document.getElementById("bgmButton");


/* =========================================
   ティーチくんに喋らせる
========================================= */

function teachTalk(message) {

    // セリフが指定されていなかったらランダム
    let randomMessage;

    if (!message) {

        const randomIndex =
            Math.floor(Math.random() * teachMessages.length);

        randomMessage = teachMessages[randomIndex];

    } else {

        // 指定されたセリフを探す
        randomMessage = teachMessages.find(
            item => item.text === message
        );

        // 見つからなかった場合
        if (!randomMessage) {
            randomMessage = {
                text: message,
                audio: null
            };
        }
    }

    // 吹き出しにセリフを入れる
    teachBubble.textContent = randomMessage.text;

    // 一度非表示にする
    teachBubble.classList.remove("show");

    // 少し待ってから表示
    setTimeout(() => {
        teachBubble.classList.add("show");
    }, 50);

    // 音声を再生
    if (randomMessage.audio) {

        const audio = new Audio(randomMessage.audio);

        audio.play().catch(error => {
            console.log("音声を再生できませんでした:", error);
        });

    }

    // 10秒後に消す
    setTimeout(() => {
        teachBubble.classList.remove("show");
    }, 10000);
}

/* =========================================
   ティーチくんをクリック
========================================= */

if (teachImage && teachBubble) {

    teachImage.addEventListener("click", () => {

        teachTalk();

        // ちょっとだけ跳ねる

    });

}


/* =========================================
   ページを開いたときのセリフ
========================================= */

window.addEventListener("load", () => {

    if (teachImage && teachBubble) {

        setTimeout(() => {
            teachTalk("やあ、ボクはティーチくんだよ");
        }, 1000);

    }

});


/* =========================================
   ランダムでティーチくんが喋る
========================================= */

function randomTeachTalk() {

    // 30～60秒くらいのランダムな時間
    const randomTime =
        Math.floor(Math.random() * 10000) + 30000;

    setTimeout(() => {

        teachTalk();

        randomTeachTalk();
        

    }, randomTime);

    
}

randomTeachTalk();


/* =========================================
   BGM ON / OFF
========================================= */

let bgmPlaying = false;


bgmButton.addEventListener("click", () => {

    if (bgmPlaying) {

        // BGMを止める
        bgm.pause();

        bgmButton.textContent = "🎵 BGM ON";

        bgmPlaying = false;

    } else {

        // BGMを再生
        bgm.play()
            .then(() => {

                bgmButton.textContent = "🔇 BGM OFF";

                bgmPlaying = true;

            })
            .catch((error) => {

                console.log("BGMを再生できませんでした:", error);

            });

    }

});
// =========================================
// 隠しコメントシステム
// =========================================

const secretComment = document.getElementById("secretComment");
const secretPopup = document.getElementById("secretPopup");
const secretClose = document.getElementById("secretClose");


// ランダムで出現するコメント
const secretComments = [
    "お前さては……暇だな？",
    "空いてるとこ５回クリックしてみｗ",
    "このサイトは俺っちが乗っ取ってやるよｗ",
    "バーカｗｗｗ",
    "ｗｗｗｗｗ"
];


// コメントを出す
function showSecretComment() {

    // ランダムな文章を選ぶ
    const randomIndex =
        Math.floor(Math.random() * secretComments.length);

    secretComment.textContent =
        secretComments[randomIndex];

    // アニメーションをリセット
    secretComment.classList.remove("show");

    // 強制的に再描画
    void secretComment.offsetWidth;

    // 表示
    secretComment.classList.add("show");
}

// =========================================
// 5回クリックで合言葉入力画面
// =========================================

let secretClickCount = 0;

// 合言葉
const SECRET_PASSWORD = "ねこはねこでもふもふものねこ";

// 要素取得
const passwordPopup =
    document.getElementById("passwordPopup");

const passwordInput =
    document.getElementById("passwordInput");

const passwordButton =
    document.getElementById("passwordButton");

const passwordClose =
    document.getElementById("passwordClose");

const passwordResult =
    document.getElementById("passwordResult");


// トップページをクリックした回数を数える
document.addEventListener("click", (event) => {

    // 合言葉画面や隠しコメントをクリックした場合は数えない
    if (
        event.target.closest("#passwordPopup") ||
        event.target.closest("#secretComment")
    ) {
        return;
    }

    secretClickCount++;

    console.log(
        "秘密のクリック：" + secretClickCount
    );


    // 5回クリック！
    if (secretClickCount >= 5) {

        passwordPopup.style.display = "flex";

        // カウントをリセット
        secretClickCount = 0;

        // 入力欄にフォーカス
        setTimeout(() => {
            passwordInput.focus();
        }, 100);
    }
});


// 合言葉チェック
passwordButton.addEventListener("click", () => {

    const input =
        passwordInput.value.trim();


    if (input === SECRET_PASSWORD) {

    passwordResult.textContent = "正解！！";
    passwordResult.style.color = "#00ff66";

    setTimeout(() => {
        window.location.href = "secret.html";
    }, 800);

} else {

        passwordResult.textContent =
            "違うゾｗ";

        passwordResult.style.color =
            "#ff5555";
    }
});


// 閉じる
passwordClose.addEventListener("click", () => {

    passwordPopup.style.display = "none";

    passwordInput.value = "";
    passwordResult.textContent = "";
});
// 20秒ごとに出現
setInterval(() => {
    showSecretComment();
}, 20000);


// コメントをクリック
secretComment.addEventListener("click", () => {

    // アニメーションを止める
    secretComment.classList.remove("show");

    // ポップアップ表示
    secretPopup.style.display = "flex";
});


// 閉じる
secretClose.addEventListener("click", () => {
    secretPopup.style.display = "none";
});
/* =========================================
   🥝 カーソルについてくるキウイ
========================================= */
/* =========================================
   🥝 カーソルについてくるキウイ
========================================= */

const cursorKiwi = document.getElementById("cursorKiwi");

if (cursorKiwi) {

    document.addEventListener("mousemove", (event) => {

        cursorKiwi.style.left = event.clientX + "px";
        cursorKiwi.style.top = event.clientY + "px";

    });

}

