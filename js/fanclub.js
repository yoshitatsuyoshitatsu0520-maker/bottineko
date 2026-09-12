
/* =========================================
   Firebase / Firestore
========================================= */

import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";

import {
    getFirestore,
    collection,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";


const firebaseConfig = {
    apiKey: "AIzaSyAIwaGRB6ffUB1t7emLsXqFpfYDQ5d7WjQ",
    authDomain: "teach-fanclub.firebaseapp.com",
    projectId: "teach-fanclub",
    storageBucket: "teach-fanclub.firebasestorage.app",
    messagingSenderId: "350154920039",
    appId: "1:350154920039:web:20f0f1c2fbe0780e1044c2"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


/* =========================================
   DOM
========================================= */

const joinButton =
    document.getElementById("joinButton");

const closeJoinButton =
    document.getElementById("closeJoinButton");

const createMemberButton =
    document.getElementById("createMemberButton");

const joinModal =
    document.getElementById("joinModal");

const memberName =
    document.getElementById("memberName");

const favoriteCharacter =
    document.getElementById("favoriteCharacter");

const memberMessage =
    document.getElementById("memberMessage");

const memberList =
    document.getElementById("memberList");


/* =========================================
   会員データ
========================================= */

let members = [];

let myMemberId =
    localStorage.getItem("teachFanclubMyMemberId");


/* =========================================
   Firestoreから会員を読み込む
========================================= */

async function loadMembers() {

    try {

        const snapshot =
            await getDocs(
                collection(db, "members")
            );


        members = [];


        snapshot.forEach(document => {

            members.push({
                id: document.id,
                ...document.data()
            });

        });


        /*
         * 会員番号順に並べる
         */

        members.sort(
            (a, b) => a.number - b.number
        );


        displayMembers();


    } catch (error) {

        console.error(
            "会員データの読み込みに失敗しました。",
            error
        );

        

    }

}


/* =========================================
   参加ボタン
========================================= */

joinButton.addEventListener(
    "click",
    () => {

        /*
         * すでに会員なら編集モード
         */

        if (myMemberId) {

            const myMember =
                members.find(
                    member =>
                        member.id === myMemberId
                );


            if (myMember) {

                memberName.value =
                    myMember.name;

                favoriteCharacter.value =
                    myMember.favorite;

                memberMessage.value =
                    myMember.message;

            }

        }


        joinModal.classList.add("show");

    }
);


/* =========================================
   閉じる
========================================= */

closeJoinButton.addEventListener(
    "click",
    () => {

        joinModal.classList.remove("show");

    }
);


/* =========================================
   会員証を作成・編集
========================================= */

createMemberButton.addEventListener(
    "click",
    async () => {

        const name =
            memberName.value.trim();

        const favorite =
            favoriteCharacter.value;

        const message =
            memberMessage.value.trim();


        if (!name) {

            alert(
                "ニックネームを入力してね！"
            );

            return;

        }


        /*
         * =====================================
         * 既存会員の編集
         * =====================================
         */

        if (myMemberId) {

            const myMember =
                members.find(
                    member =>
                        member.id === myMemberId
                );


            if (myMember) {

                try {

                    await updateDoc(
                        doc(
                            db,
                            "members",
                            myMemberId
                        ),
                        {
                            name: name,
                            favorite: favorite,
                            message:
                                message ||
                                "よろしくお願いします！"
                        }
                    );


                    myMember.name = name;

                    myMember.favorite =
                        favorite;

                    myMember.message =
                        message ||
                        "よろしくお願いします！";


                    joinModal.classList.remove(
                        "show"
                    );


                    displayMembers();


                    alert(
                        "会員証を更新したよ！🎫"
                    );


                } catch (error) {

                    console.error(error);

                    alert(
                        "更新に失敗しました……！"
                    );

                }

                return;

            }

        }


        /*
         * =====================================
         * 新規会員
         * =====================================
         */

        try {

            /*
             * 次の会員番号
             */

            const nextNumber =
                members.length > 0
                ? Math.max(
                    ...members.map(
                        member =>
                            Number(member.number) || 0
                    )
                ) + 1
                : 1;


            const newMember = {

                number: nextNumber,

                name: name,

                favorite: favorite,

                message:
                    message ||
                    "よろしくお願いします！"

            };


            /*
             * Firestoreへ保存
             */

            const documentReference =
                await addDoc(
                    collection(db, "members"),
                    newMember
                );


            /*
             * 自分の会員証IDを保存
             */

            myMemberId =
                documentReference.id;


            localStorage.setItem(
                "teachFanclubMyMemberId",
                myMemberId
            );


            /*
             * ローカルの表示にも追加
             */

            members.push({

                id: myMemberId,

                ...newMember

            });


            joinModal.classList.remove(
                "show"
            );


            memberName.value = "";

            memberMessage.value = "";


            displayMembers();


            alert(
                "ファンクラブに参加したよ！🎫🐱"
            );


        } catch (error) {

            console.error(error);

            alert(
                "会員証の作成に失敗しました……！"
            );

        }

    }
);

/* =========================================
   会員証表示
========================================= */

function displayMembers() {

    memberList.innerHTML = "";

    members.forEach(member => {

        const card = document.createElement("div");

        card.className = "member-card";

        const isMine = member.id === myMemberId;

        let html =
            '<div class="member-card-header">🥝 TEACH FAN CLUB</div>' +
            '<div class="member-number">No.' +
            String(member.number).padStart(4, "0") +
            '</div>' +
            '<div class="member-name">' +
            escapeHTML(member.name) +
            '</div>' +
            '<div class="member-info">♡ 推し：' +
            escapeHTML(member.favorite) +
            '</div>' +
            '<div class="member-message">「' +
            escapeHTML(member.message) +
            '」</div>';

        if (isMine) {

            html +=
                '<div class="member-actions">' +
                '<button class="edit-member-button" onclick="editMember()">編集</button>' +
                '<button class="delete-member-button" onclick="deleteMember()">削除</button>' +
                '</div>';

        }

        card.innerHTML = html;

        memberList.appendChild(card);

    });

    if (members.length === 0) {

        memberList.innerHTML =
            '<p class="no-members">' +
            'まだ会員はいないみたい……！<br>' +
            '最初の会員になってみよう🐱💙' +
            '</p>';

    }

}
/* =========================================
   編集
========================================= */

window.editMember = function () {

    const myMember =
        members.find(
            member =>
                member.id === myMemberId
        );


    if (!myMember) {

        return;

    }


    memberName.value =
        myMember.name;

    favoriteCharacter.value =
        myMember.favorite;

    memberMessage.value =
        myMember.message;


    joinModal.classList.add("show");

};


/* =========================================
   削除
========================================= */

window.deleteMember = async function () {

    const answer =
        confirm(
            "本当に会員証を削除する？"
        );


    if (!answer) {

        return;

    }


    try {

        await deleteDoc(
            doc(
                db,
                "members",
                myMemberId
            )
        );


        members =
            members.filter(
                member =>
                    member.id !== myMemberId
            );


        localStorage.removeItem(
            "teachFanclubMyMemberId"
        );


        myMemberId = null;


        displayMembers();


        alert(
            "会員証を削除したよ。"
        );


    } catch (error) {

        console.error(error);

        alert(
            "削除に失敗しました……！"
        );

    }

};


/* =========================================
   HTMLエスケープ
========================================= */

function escapeHTML(text) {
    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* =========================================
   最初にFirestoreから読み込む
========================================= */

loadMembers();