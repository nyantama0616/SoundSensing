// アプリ全体の管理
var AppStatus = {
    TOP_PAGE: "topPage",
    TRAINING_PAGE: "trainingPage",
    NO_DEVICE: "noDevice",
    OTHER: "other"
};
var AppManager = /** @class */ (function () {
    function AppManager() {
        this._status = AppStatus.OTHER;
    }
    Object.defineProperty(AppManager.prototype, "status", {
        get: function () { return this._status; },
        set: function (_status) {
            this._status = _status;
            var el = document.getElementById("status");
            if (el) {
                el.innerText = this.status;
            }
        },
        enumerable: false,
        configurable: true
    });
    return AppManager;
}());
var appManager = new AppManager();
var Key = /** @class */ (function () {
    function Key(num) {
        this._num = num;
    }
    Key.getKey = function (i) {
        return Key.keys[i] || null;
    };
    // 鍵盤生成
    Key.createKeyboad = function (par) {
        if (par === null)
            return;
        var offset = 23; //この値で鍵盤の位置を指定
        var keyNum = 21; //鍵盤番号
        for (var i = 0; i < 88; i++) {
            var div = document.createElement("div");
            div.classList.add("key");
            var img = document.createElement("img");
            // 白鍵か黒鍵かで分ける
            if (Key.scale[i % 12] === 1) {
                div.classList.add("white");
                img.src = "../assets/img/white_key.png";
            }
            else {
                div.classList.add("black");
                img.src = "../assets/img/black_key.png";
            }
            div.id = "k".concat(keyNum);
            div.style.left = "".concat(offset, "px");
            div.appendChild(img);
            par.appendChild(div);
            var bit = Key.scale[(i + 1) % 12] + Key.scale[i % 12] * 2;
            switch (bit) {
                case 1:
                    offset += 5.72;
                    break;
                case 2:
                    offset += 28.6;
                    break;
                case 3:
                    offset += 34.32;
                    break;
            }
            var key = new Key(keyNum);
            Key.keys.push(key);
            ++keyNum;
        }
    };
    // keyに対応するHTML上のdiv要素を取得
    Key.prototype.getDiv = function () {
        var id = "k".concat(this._num);
        return document.getElementById(id) || null;
    };
    Key.prototype.addFilter = function (filterName) {
        var div = this.getDiv();
        var filter = document.createElement("div");
        filter.classList.add("filter");
        filter.classList.add(filterName);
        div === null || div === void 0 ? void 0 : div.appendChild(filter);
    };
    // 鍵盤が叩かれたときの処理
    Key.prototype.onHit = function () {
        this.addFilter("hit");
    };
    Key.prototype.onRight = function () {
        this.addFilter("right");
    };
    Key.prototype.onMiss = function () {
        this.addFilter("miss");
    };
    // 鍵盤が話されたときの処理
    Key.prototype.onReleased = function () {
        var div = this.getDiv();
        div.removeChild(div.lastChild);
    };
    Key.keys = [];
    Key.scale = [1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0]; //Aから始まる
    Key.imgPath = "../assets/img/";
    return Key;
}());
// MIDIとのやり取りについてのファイル
/// <reference path="AppManager.ts"/>
/// <reference path="Key.ts"/>
var MIDIManager;
(function (MIDIManager) {
    // input先とoutputs先のMIDIをすべて列挙
    function connectedCheck(midi) {
        console.log("Connectcheck");
        if (midi.inputs.size < 1 && midi.outputs.size < 1) {
            appManager.status = AppStatus.NO_DEVICE;
            return;
        }
        midi.inputs.forEach(function (input) { return console.log(input); });
        midi.outputs.forEach(function (output) { return console.log(output); });
    }
    MIDIManager.connectedCheck = connectedCheck;
    // MIDIからMessageを受け取った時の処理
    function onMessage(midi) {
        if (appManager.status == AppStatus.NO_DEVICE || midi.inputs.size < 1) {
            return;
        }
        var input = Array.from(midi.inputs).map(function (output) { return output[1]; })[0];
        input.onmidimessage = function (e) {
            var data = e.data.slice(0, 3);
            switch (data[0]) {
                case 0x90:
                    var hitKey = Key.getKey(data[1] - 21); //鍵盤が21から始まるから
                    if (hitKey) {
                        hitKey.onHit();
                    }
                    break;
                case 0x80:
                    var releasedKey = Key.getKey(data[1] - 21);
                    if (releasedKey) {
                        releasedKey.onReleased();
                    }
                    break;
                default:
                    break;
            }
        };
    }
    MIDIManager.onMessage = onMessage;
})(MIDIManager || (MIDIManager = {}));
// トレーニングモード時の画面、処理
/// <reference path="AppManager.ts"/>
/// <reference path="Key.ts"/>
var TrainingPage;
(function (TrainingPage) {
    function appear() {
        appManager.status = AppStatus.TRAINING_PAGE;
        var el = document.getElementById("training-page");
        if (el !== null) {
            el.classList.remove("disappear");
        }
        Key.createKeyboad(el);
    }
    function disappear() {
        appManager.status = AppStatus.OTHER;
        var el = document.getElementById("traning-page");
        if (el !== null) {
            el.classList.add("disappear");
        }
    }
    function run() {
        appear();
    }
    TrainingPage.run = run;
})(TrainingPage || (TrainingPage = {}));
// トップページの画面、処理
/// <reference path="AppManager.ts"/>
/// <reference path="MIDIManager.ts"/>
/// <reference path="TrainingPage.ts"/>
var TopPage;
(function (TopPage) {
    function appear() {
        appManager.status = AppStatus.TOP_PAGE;
        var el = document.getElementById("top-page");
        if (el !== null) {
            el.classList.remove("disappear");
        }
    }
    function disappear() {
        appManager.status = AppStatus.OTHER;
        var el = document.getElementById("top-page");
        if (el !== null) {
            el.classList.add("disappear");
        }
    }
    function run() {
        appear();
        var startButton = document.getElementById("start-button");
        startButton === null || startButton === void 0 ? void 0 : startButton.addEventListener("click", function () {
            if (appManager.status !== AppStatus.TOP_PAGE) {
                return;
            }
            disappear();
            TrainingPage.run();
        });
        // App開始時にこれ呼び出す
        window.navigator.requestMIDIAccess().then(function (midi) {
            MIDIManager.connectedCheck(midi);
            startMusic(midi); // 接続先のMIDIから音楽を流す(無事流れれば接続成功！)
            MIDIManager.onMessage(midi);
        });
    }
    TopPage.run = run;
})(TopPage || (TopPage = {}));
// サウンド用のファイル
// 単音を鳴らす(timeに数値を渡せば、何ms鳴らすか決めれる)
function playNote(output, note, time) {
    if (time === void 0) { time = 0; }
    output.send(note);
    // time後に音止めたいけどできない、何で。。。-> なぜが止まるようなった
    if (time) {
        setTimeout(function () {
            var data = [0x80, note[1], 100];
            output.send(data);
        }, time);
    }
}
// 和音演奏(intervalに数値を渡せば、アルペジオっぽくできる)
function playCode(output, notes, interval, time) {
    if (interval === void 0) { interval = 0; }
    if (time === void 0) { time = 0; }
    if (interval) {
        notes.forEach(function (note, i) {
            setTimeout(function () {
                playNote(output, note, time);
            }, i * interval);
        });
    }
    else {
        for (var _i = 0, notes_1 = notes; _i < notes_1.length; _i++) {
            var note = notes_1[_i];
            playNote(output, note, time);
        }
    }
}
// App開始時の音楽
function startMusic(midi) {
    if (midi.outputs.size < 1) {
        return;
    }
    var output = Array.from(midi.outputs).map(function (output) { return output[1]; })[0];
    var CodeC = [[0x90, 76, 50], [0x90, 79, 50], [0x90, 84, 50]];
    var notes = [
        [0x90, 60, 50],
        [0x90, 64, 50],
        [0x90, 67, 50],
        [0x90, 72, 50],
        [0x90, 76, 50],
        [0x90, 72, 50],
        [0x90, 79, 50],
        [0x90, 84, 50],
    ];
    playCode(output, CodeC, 60, 500);
    playCode(output, notes, 200, 500);
    // // 他の手段要検討
    setTimeout(function () {
        playCode(output, CodeC, 50, 1000);
    }, 1320);
}
// エントリーポイント
/// <reference path="AppManager.ts"/>
/// <reference path="TopPage.ts"/>
/// <reference path="sound.ts"/>
/// <reference path="MIDIManager.ts"/>
TopPage.run();
///// <reference path="TrainingPage.ts"/>
// TrainingPage.run();
