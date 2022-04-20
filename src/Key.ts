class Key {
    private static keys: Key[] = [];
    private static scale = [1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0]; //Aから始まる
    private static imgPath = "../assets/img/";
    private _num: number;

    public static getKey(i: number): Key | null {
        return Key.keys[i] || null;
    }

    // 鍵盤生成
    public static createKeyboad(par: HTMLElement | null) {
        if (par === null) return;
        let offset = 23; //この値で鍵盤の位置を指定
        let keyNum = 21; //鍵盤番号
        for (let i = 0; i < 88; i++) {
            const div = document.createElement("div");
            div.classList.add("key");
            const img = document.createElement("img");
            // 白鍵か黒鍵かで分ける
            if (Key.scale[i % 12] === 1) {
                div.classList.add("white");
                img.src = "../assets/img/white_key.png";
            } else {
                div.classList.add("black");
                img.src = "../assets/img/black_key.png";
            }
            div.id = `k${keyNum}`;
            div.style.left = `${offset}px`;
            div.appendChild(img);
            par.appendChild(div);

            let bit = Key.scale[(i + 1) % 12] + Key.scale[i % 12] * 2;
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
            const key = new Key(keyNum);
            Key.keys.push(key);
            ++keyNum;
        }
    }

    constructor(num: number) {
        this._num = num;
    }

    // keyに対応するHTML上のdiv要素を取得
    private getDiv(): HTMLElement | null {
        const id = `k${this._num}`;
        return document.getElementById(id) || null;
    }

    private addFilter(filterName: string) {
        const div = this.getDiv();
        const filter = document.createElement("div");
        filter.classList.add("filter");
        filter.classList.add(filterName);
        div?.appendChild(filter);
        
    }

    // 鍵盤が叩かれたときの処理
    onHit() {
        this.addFilter("hit");
    }
    
    onRight() {
        this.addFilter("right");
    }
    
    onMiss() {
        this.addFilter("miss");
    }
    
    // 鍵盤が話されたときの処理
    onReleased() {
        const div = this.getDiv();
        div!.removeChild(div!.lastChild!)
    }
}
