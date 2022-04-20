// トレーニングモード時の画面、処理

/// <reference path="AppManager.ts"/>
/// <reference path="Key.ts"/>
/// <reference path="lib/math.ts"/>

module TrainingPage {
    function appear() {
        appManager.status = AppStatus.TRAINING_PAGE;
        const el = document.getElementById("training-page");
        if (el !== null) {
            el.classList.remove("disappear");
        }
        Key.createKeyboad(el);
    }
    
    function disappear() {
        appManager.status = AppStatus.OTHER;
        const el = document.getElementById("traning-page");
        if (el !== null) {
            el.classList.add("disappear");
        }
    }
    
    export function run() {
        appear();
    }
}
