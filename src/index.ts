// input先とoutputs先のMIDIをすべて列挙
function ConnectedCheck(midi: WebMidi.MIDIAccess) {
    console.log("print!");
    midi.inputs.forEach((input) => console.log(input));
    midi.outputs.forEach((output) => console.log(output));
}

// 和音演奏(intervalに数値を渡せば、アルペジオっぽくできる)
function playCode(output: WebMidi.MIDIOutput, notes: any[], interval=0) {
    if (interval) {
        console.log("interval");
        
        notes.forEach((note, i) => {
            setTimeout(() => {
                output.send(note);
            }, i * interval);
        });
    } else {
        for (let note of notes) {
            output.send(note);
        }
    }
}

// Appアクセス時に接続先のMIDIから音楽を流す(無事流れれば接続成功！)
function startMusic(midi: WebMidi.MIDIAccess) {
    if (midi.outputs.size < 1) { return }
    const output = Array.from(midi.outputs).map((output) => output[1])[0];
    const CodeC = [[0x90, 76, 50], [0x90, 79, 50], [0x90, 84, 50]];
    const notes = [
        [0x90, 60, 50],
        [0x90, 64, 50],
        [0x90, 67, 50],
        [0x90, 72, 50],
        [0x90, 76, 50],
        [0x90, 72, 50],
        [0x90, 79, 50],
        [0x90, 84, 50],
    ];
    playCode(output, CodeC, 60);
    playCode(output, notes, 200);
    // 他の手段要検討
    setTimeout(() => {
        playCode(output, CodeC, 50);
    }, 1320)
}

// MIDIからMessageを受け取った時の処理
function onMessage(midi: WebMidi.MIDIAccess) {
    if (midi.inputs.size < 1) { return }
    const input = Array.from(midi.inputs).map((output) => output[1])[0];
    input.onmidimessage = (e: WebMidi.MIDIMessageEvent) => {
        const data = e.data.slice(0, 3);
        switch (data[0]) {
            case 0x90:
                console.log("ON!");
                console.log(data);
                break;
            case 0x80:
                console.log("OFF!");
                break;
            default:
                console.log("other", data);
                break;
        }
    }
}

window.navigator.requestMIDIAccess().then((midi) => {
    ConnectedCheck(midi);
    startMusic(midi);
    onMessage(midi);
});
