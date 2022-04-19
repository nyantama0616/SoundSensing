// input先とoutputs先のMIDIをすべて列挙
function ConnectedCheck(midi) {
    console.log("print!");
    midi.inputs.forEach(function (input) { return console.log(input); });
    midi.outputs.forEach(function (output) { return console.log(output); });
}
function playCode(output, notes, interval) {
    if (interval === void 0) { interval = 0; }
    if (interval) {
        console.log("interval");
        notes.forEach(function (note, i) {
            setTimeout(function () {
                output.send(note);
            }, i * interval);
        });
    }
    else {
        for (var _i = 0, notes_1 = notes; _i < notes_1.length; _i++) {
            var note = notes_1[_i];
            output.send(note);
        }
    }
}
// Appアクセス時に接続先のMIDIから音楽を流す(無事流れれば接続成功！)
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
    playCode(output, CodeC, 60);
    playCode(output, notes, 200);
    // 他の手段要検討
    setTimeout(function () {
        playCode(output, CodeC, 50);
    }, 1320);
}
// MIDIからMessageを受け取った時の処理
function onMessage(midi) {
    if (midi.inputs.size < 1) {
        return;
    }
    var input = Array.from(midi.inputs).map(function (output) { return output[1]; })[0];
    input.onmidimessage = function (e) {
        var data = e.data.slice(0, 3);
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
    };
}
window.navigator.requestMIDIAccess().then(function (midi) {
    ConnectedCheck(midi);
    startMusic(midi);
    onMessage(midi);
});
