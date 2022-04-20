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
        Training.run();
    }
}

class Training {
    private static tempo = 100;
    private static _numOfNote = 2;
    private static _minNote = 48;
    private static _maxNote = 72;
    private _notes: Set<number>;
    private _checked: Set<number>;
    private static beatIntervalId: number;
    private static beatCounter = 0;
    constructor() {
        this._notes = new Set<number>();
        this._checked = new Set<number>();
        for (let i = 0; i < Training._numOfNote; ++i) {
            let note;
            do {
                note = getRandomIntInclusive(Training._minNote, Training._maxNote);
            } while (this._notes.has(note));
            this._notes.add(note);
        }
    }

    get notes(): Set<number> {
        return this._notes;
    }

    private checkCompleted() {
        if (this._checked.size >= Training._numOfNote) {
            Training.nextTraining();
        }
    }

    checkAnser(key: number) {
        if (this._notes.has(key)) {
            if (!this._checked.has(key)) {
                this._checked.add(key);
                this.checkCompleted();
            }
            return true;
        }
        return false;
    }

    public static nextTraining() {
        setTimeout(() => {
            appManager.training = new Training();
        }, 1000);
    }

    public static run() {
        Training.nextTraining();
    }
}
