const plan = document.getElementById("plan");
const auswahl = document.getElementById("auswahl")
auswahl.addEventListener("change", showSchicht);
const schichtTyp = document.getElementById("schichtTyp")
schichtTyp.addEventListener("change", showSchicht);
const dateSelector = document.getElementById("dateSelector");
dateSelector.addEventListener("change", newRender)
//adebc
const schichtAblauf = ['s', 's', 's', '-', 'f', 'f', 'f', 'f', '-', 'n', 'n', 'n', 'n', '-', '-', 'f', 'f', 'f', '-', '-', 'n', 'n', 'n', '-', 's', 's', 's', 's', '-', '-', '-', '-', '-', '-', '-'] 
const schichtStart= new Date('1/2/2024');
const dayTranslate = {
                    0: "Sonntag",
                    1: "Montag",
                    2: "Dienstag",
                    3: "Mittwoch",
                    4: "Donnerstag",
                    5: "Freitag",
                    6: "Samstag",   
                }
const schichtBedeutung = {ot: 
                        {f: {
                            begin: 5,
                            end: 11 
                            },
                        s: {begin: 12,
                            end: 19
                        },
                        n: {begin: 20,
                            end: 4}
                        },  
                        oc:
                        {f:{ 
                            begin: 5,
                            end: 12 
                            },
                        s: {
                            begin: 13,
                            end: 19
                        },
                        n: {
                            begin: 20,
                            end: 4}
                        }}
const schichtOffset = { a: 0,
                        d: 7,
                        e: 21,
                        b: 14,
                        c: 28}

function getSchicht(plan, offset){
    const today = (dateSelector.value) ? new Date(dateSelector.value): new Date();
    const diffTime = Math.abs(today - schichtStart);
    const diffDays = (Math.ceil(diffTime / (1000 * 60 * 60 * 24))  - 1  + schichtOffset[auswahl.value])% schichtAblauf.length;
    return plan[offset + diffDays]
}

function clearTable(){
    for(let i = 1; i <= 25; i++){
        const row = plan.rows[i]
        for(let j = 1; j < 9; j++){
            const cell = row.cells[j]
            cell.classList.remove("schicht")
        }
    }
}

function showSchicht(){
    clearTable()
    for(let offset = -1; offset < 7; offset++){
        const schicht = getSchicht(schichtAblauf, offset)
        if(schicht === '-'){
            continue
        }
        const begin = schichtBedeutung[schichtTyp.value][schicht].begin + 1;
        const end = schichtBedeutung[schichtTyp.value][schicht].end + 1;
        if(schicht === 'n'){
            for(let i = begin; i <= 25; i++){
                const row = plan.rows[i];
                const cell = row.cells[offset + 2];
                cell.classList.add("schicht");
            }
            if(offset < 6){
                for(let i = 1; i <= end; i++){
                    const row = plan.rows[i];
                    const cell = row.cells[offset + 3];
                    cell.classList.add("schicht");
                }
            }
        }
        else{
            for(let i = begin; i <= end; i++){
                const row = plan.rows[i];
                const cell = row.cells[offset + 2];
                cell.classList.add("schicht");
            }
        }
    }   
}

function generateTable(){
    for(let i = -1; i < 7; i++){
        const head = document.createElement("th");
        const date = (dateSelector.value) ? new Date(dateSelector.value): new Date();
        const day = date.getDay()
        const text = document.createTextNode(`${dayTranslate[(day + i)%7]}`)
        head.appendChild(text);
        plan.rows[0].appendChild(head);
        plan.rows[0].cells[i + 2].classList.add("weekday")
    }
    for(let i = 0; i < 25; i++){
        const row = document.createElement("tr");
        let cell = document.createElement("td")
        const text = document.createTextNode(`${i}:00`)
        cell.appendChild(text)
        row.appendChild(cell)
        for(let j = 1; j < 9; j++){
            cell = document.createElement("td");
            row.appendChild(cell)
        }
        plan.appendChild(row)
    }
}
function newRender(){
    for(let i = -1; i < 7; i++){
        const date = (dateSelector.value) ? new Date(dateSelector.value): new Date();
        const day = date.getDay()
        plan.rows[0].cells[i + 2].innerText = `${dayTranslate[(day + i)%7]}`;
    }
    showSchicht();
}
generateTable();
showSchicht();