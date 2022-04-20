// トップページの画面、処理
/// <reference path="AppManager.ts"/>
/// <reference path="MIDIManager.ts"/>
/// <reference path="TrainingPage.ts"/>

module TopPage {
    function appear() {
        appManager.status = AppStatus.TOP_PAGE;
        const el = document.getElementById("top-page");
        if (el !== null) {
            el.classList.remove("disappear");
        }
    }

    function disappear() {
        appManager.status = AppStatus.OTHER;
        const el = document.getElementById("top-page");
        if (el !== null) {
            el.classList.add("disappear");
        }
    }

    export function run() {
        appear();
        const startButton = document.getElementById("start-button");
        startButton?.addEventListener("click", () => {
            if (appManager.status !== AppStatus.TOP_PAGE) { return; }
            disappear();
            TrainingPage.run();
        });

        // App開始時にこれ呼び出す
        window.navigator.requestMIDIAccess().then((midi) => {
            MIDIManager.connectedCheck(midi);
            startMusic(midi); // 接続先のMIDIから音楽を流す(無事流れれば接続成功！)
            MIDIManager.onMessage(midi);
        });
    }
}
