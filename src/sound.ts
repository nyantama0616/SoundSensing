// サウンド用のファイル

// 単音を鳴らす(timeに数値を渡せば、何ms鳴らすか決めれる)
function playNote(output: WebMidi.MIDIOutput, note: any[], time = 0) {
    output.send(note);

    // time後に音止めたいけどできない、何で。。。-> なぜが止まるようなった
    if (time) {
        setTimeout(() => {
            const data = [0x80, note[1], 100];
            output.send(data);
        }, time);
    }
}

// 和音演奏(intervalに数値を渡せば、アルペジオっぽくできる)
function playCode(output: WebMidi.MIDIOutput, notes: any[], interval = 0, time = 0) {
    if (interval) {
        notes.forEach((note, i) => {
            setTimeout(() => {
                playNote(output, note, time);
            }, i * interval);
        });
    } else {
        for (let note of notes) {
            playNote(output, note, time);
        }
    }
}

// アクセス時用の音楽
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
    playCode(output, CodeC, 60, 500);
    playCode(output, notes, 200, 500);
    // // 他の手段要検討
    setTimeout(() => {
        playCode(output, CodeC, 50, 1000);
    }, 1320)
}
