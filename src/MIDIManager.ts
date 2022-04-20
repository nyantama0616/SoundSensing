// MIDIとのやり取りについてのファイル

/// <reference path="AppManager.ts"/>
/// <reference path="Key.ts"/>

module MIDIManager {
    // input先とoutputs先のMIDIをすべて列挙
    export function connectedCheck(midi: WebMidi.MIDIAccess) {
        console.log("Connectcheck");
        if (midi.inputs.size < 1 && midi.outputs.size < 1) {
            appManager.status = AppStatus.NO_DEVICE;
            return;
        }
        midi.inputs.forEach((input) => console.log(input));
        midi.outputs.forEach((output) => console.log(output));
    }
    
    // MIDIからMessageを受け取った時の処理
    export function onMessage(midi: WebMidi.MIDIAccess) {
        if (appManager.status == AppStatus.NO_DEVICE || midi.inputs.size < 1) { return }
        const input = Array.from(midi.inputs).map((output) => output[1])[0];
        input.onmidimessage = (e: WebMidi.MIDIMessageEvent) => {
            const data = e.data.slice(0, 3);
            switch (data[0]) {
                case 0x90:
                    const hitKey = Key.getKey(data[1] - 21); //鍵盤が21から始まるから
                    if (hitKey) {
                        hitKey.onHit();
                    }
                    break;
                case 0x80:
                    const releasedKey = Key.getKey(data[1] - 21);
                    if (releasedKey) {
                        releasedKey.onReleased();
                    }
                    break;
                default:
                    break;
            }
        }
    }
}
