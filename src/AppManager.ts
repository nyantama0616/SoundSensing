// アプリ全体の管理

/// <reference path="sound.ts"/>
/// <reference path="TrainingPage.ts"/>


const AppStatus = {
    TOP_PAGE: "topPage",
    TRAINING_PAGE: "trainingPage",
    NO_DEVICE: "noDevice", //デバイスがない場合の処理も必要
    OTHER: "other"
} as const;

type AppStatus = typeof AppStatus[keyof typeof AppStatus];

class AppManager {
    private _status: AppStatus;
    private _training: Training | null;
    private trainingIntervalId: number | null;
    constructor() {
        this._status = AppStatus.OTHER;
        this._training = null;
        this.trainingIntervalId = null;
    }
    
    get status(): AppStatus { return this._status; }
    set status(_status: AppStatus) {
        this._status = _status;
        const el = document.getElementById("status");
        if (el) { el.innerText = this.status; }
    }

    set training(training: Training | null) {
        if (this.trainingIntervalId !== null) {
            window.clearInterval(this.trainingIntervalId);
        }
        this._training = training;
        console.log("ans: ", training?.notes);
        
        window.navigator.requestMIDIAccess().then((midi) => {
            let bytes = [];
            training?.notes.forEach((note) => {
                bytes.push([0x90, note, 80]);
            });
            const output = Array.from(midi.outputs).map((output) => output[1])[0];
            // console.log(bytes, "hh");
            playCode(output, bytes, 0, 1500);
            this.trainingIntervalId = window.setInterval(() => {
                playCode(output, bytes, 0, 1500);
            }, 3000);
        });
    }
    
    get training(): Training | null {
        return this._training;
    }
}

const appManager = new AppManager();
