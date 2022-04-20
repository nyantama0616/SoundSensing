// トレーニングモード時の画面、処理

/// <reference path="AppManager.ts"/>

module TrainingPage {
    function createKeyboad(par: HTMLElement | null) {
        if (par === null) return;
        const scale = [1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0];
        let offset = 23;
        for (let i = 0; i < 88; i++) {
            const div = document.createElement("div");
            div.classList.add("key");
            const img = document.createElement("img");
            // 白鍵か黒鍵かで分ける
            if (scale[i % 12] == 1) {
                div.classList.add("white");
                img.src = "../assets/img/white_key.png";
            } else {
                div.classList.add("black");
                img.src = "../assets/img/black_key.png";
            }
            div.style.left = `${offset}px`;
            div.appendChild(img);
            par.appendChild(div);
            
            let bit = scale[(i + 1) % 12] + scale[i % 12] * 2;
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
        }
        console.log(offset + 43);
        
    }

    function appear() {
        appManager.status = AppStatus.TRAINING_PAGE;
        const el = document.getElementById("training-page");
        if (el !== null) {
            el.classList.remove("disappear");
        }
        
        createKeyboad(el);
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
        console.log("TrainingPage");
    }
}
