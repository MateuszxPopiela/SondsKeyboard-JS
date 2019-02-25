
// Tworzenie nas�uchiwaczy
window.addEventListener("keydown", keyDown);
window.addEventListener("keyup", keyUp);
window.addEventListener("mouseup", mouseUp);
window.addEventListener("mousedown", mouseDown);
window.addEventListener("click", clickHandler);
//tworzenie podstawowych tablic
let sciezka = [[]], record = [], time = [], sound= [];
// lista d�wi�k�w przypisana do ka�dego klawisza
let soundList = {
    q: "boom",
    w: "clap",
    e: "hihat",
    r: "kick",
    t: "openhat",
    y: "ride",
    u: "snare",
    i: "tink",
    o: "tom"
}
function loadAudio() { //wczytanie d�wi�k�w
    Object.values(soundList).forEach((e) => sound[e] = new Audio('./sounds/' + e + '.wav'));
}
function keyDown(e) { // nacisniecie klawisza
    if (document.getElementById(e.key)) {
        document.getElementById(e.key).classList.add('key-pressed') //jesli element istnieje, to dodaje do niego klase
        playKey(e);
    }
}
function keyUp(e) { // puszczenie klawisza
    if (document.getElementById(e.key)) {
        document.getElementById(e.key).classList.remove('key-pressed')
    }
}
function mouseDown(e) { // nacisniecie przycisku msyzki
    if (Object.keys(soundList).indexOf(e.target.id) > -1) {
        e.target.classList.add('key-pressed')
    }
}
function mouseUp(e) { // puszczenie przycisku myszki
    if (Object.keys(soundList).indexOf(e.target.id) > -1) {
        e.target.classList.remove('key-pressed')
    }
}


function clickHandler(e) { // funkcja sprawdza na ktorym klawiszu jest myszka i w��cza go.
    if (Object.keys(soundList).indexOf(e.target.id) > -1) {
        playKey({ key: e.target.id });
    }
}
function startRecord(numer_sciezki) { // nagrywanie sciezki
    if (!record[numer_sciezki]) { // jesli nie ma sciezki o danym numerze, tworzy j� z aktualnym czasem, zaczyna nagrywa� i zmienia napis na przycisku
        record[numer_sciezki] = true;
        time[numer_sciezki] = Date.now();
        sciezka[numer_sciezki] = [];
        document.getElementById("rB" + numer_sciezki).innerText = "Stop recording";

    }
    else { // jesli istnieje sciezka, to przestaje j� nagrywa� i wyswietla informacje o sciezce.
        record[numer_sciezki] = false;
        document.getElementById("rB" + numer_sciezki).innerText = "Record track " + numer_sciezki;
        document.getElementById("status" + numer_sciezki).innerText = sciezka[numer_sciezki].length + " Sounds recorded in " + Math.round(sciezka[numer_sciezki][sciezka[numer_sciezki].length-1].delay/100)/10+"sec";
    }
}
function playKey(e) { // funkcja grania muzyki
    sound[soundList[e.key]].currentTime=0 // zeruje czas dzwieku
    sound[soundList[e.key]].play();
    console.log(soundList[e.key]);

    for (i = 1; i <= sciezka.length; i++){ // sprawdza, czy w��czone jest nagrywanie dla ka�dej �cie�ki
        if (record[i]) {
            if (Object.keys(soundList).indexOf(e.key) > -1) { //je�li naciskany jest poprawny klawisz, dodaje go do sciezki z czasem nagrania
                sciezka[i].push(
                    {
                        delay: Date.now() - time[i],
                        key: e.key
                    })
            }
        }
    }
}
let timeout = [], koniec = [];

function playRecord(numer_sciezki) { //odtwarzanie sciezki
    if (!timeout[numer_sciezki] && sciezka[numer_sciezki][0]) { // je�li nie ma timeout dla sciezki, tworzy go dla ka�dego elementu sciezki z odpowiadaj�cym mu op�nieniem.
        sciezka[numer_sciezki].forEach((e) => {
            timeout[numer_sciezki] = setTimeout(() => { playKey(e) }, e.delay);
        })
        document.getElementById("B" + numer_sciezki).innerText = "Stop playing";
        koniec[numer_sciezki] = setTimeout(() => playRecord(numer_sciezki), sciezka[numer_sciezki][sciezka[numer_sciezki].length - 1].delay + 10) // gdy sko�czy si� sciezka, przycisk automatycznie zmienia si� ponownie na "play"
    }
    else { // je�li naci�ni�ty b�dzie przycisk podczas grania sciezki, usuwa si� wszystkie timeouty i przywraca przycisk do "Play"
        clearTimeout(koniec[numer_sciezki]);
        do {
            clearTimeout(timeout[numer_sciezki]);
        }
        while (timeout[numer_sciezki]--)
        timeout[numer_sciezki] = false;
        document.getElementById("B" + numer_sciezki).innerText = "Play track " + numer_sciezki;
    }
}
