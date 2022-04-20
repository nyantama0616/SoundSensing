// アプリ全体の管理

const AppStatus = {
    TOP_PAGE: "topPage",
    TRAINING_PAGE: "trainingPage",
    NO_DEVICE: "noDevice", //デバイスがない場合の処理も必要
    OTHER: "other"
} as const;

type AppStatus = typeof AppStatus[keyof typeof AppStatus];

class AppManager {
    private _status: AppStatus;
    
    constructor() {
        this._status = AppStatus.OTHER;
    }
    
    get status(): AppStatus { return this._status; }
    set status(_status: AppStatus) {
        this._status = _status;
        const el = document.getElementById("status");
        if (el) { el.innerText = this.status; }
    }
}

const appManager = new AppManager();
