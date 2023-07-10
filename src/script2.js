let cards = [
    createCard("Hej", "Hello"),
    createCard("En bil", "a car")
];
let currentCard = 0;

function createCard(front, back){
    return ({
        front: front,
        back: back
    });
}

function showCard(card){
    let container = document.querySelector("#flashCardContainer");
    let cardDiv = container.querySelector("#card");
    if (cardDiv == undefined){
        cardDiv = document.createElement("div");
        cardDiv.id = "card";
        cardDiv.style.border = "1px black solid";
        cardDiv.style.width = "15em";
        cardDiv.style.height = cardDiv.style.lineHeight = "4em";
        cardDiv.style.textAlign = "center";
        cardDiv.style.verticalAlign = "middle";
        cardDiv.style.userSelect = "none";
        container.appendChild(cardDiv);
    }
    cardDiv.innerText = card.front;
    let frontShown = true;
    cardDiv.addEventListener("click", x => {
        cardDiv.innerText = frontShown ? card.back : card.front;
        frontShown = !frontShown;
    });
}

function previousButton(e){
    currentCard -= 1;
    if (currentCard < 0) currentCard = cards.length-1;
    update();
}

function nextButton(e){
    currentCard = (currentCard + 1) % cards.length;
    update();
}

function update(){ showCard(cards[currentCard]); }



/*****************/
/* api calls     */
/*****************/
function ajaxGetMock(url, okHandler, responseMock){
    if (responseMock == undefined){
        if (url.indexOf("api/") != -1){
            responseMock = [
                createCard("Et hus","a house"),
                createCard("En mus", "a mouse"),
                createCard("Et bord", "a table"),
                createCard("En bil", "a car")
            ];
        }
    }
    setTimeout(okHandler(responseMock), 1000);
}

function ajaxGet(url, okHandler){
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
        if (xhr.readyState == XMLHttpRequest.DONE){
            if (xhr.status == 200){
                okHandler(xhr.response);
            } else {
                throw `xhr status from GET call to ${url}: ${xhr.status}`
            }
        }
    };
    xhr.open("GET", url, true);
    xhr.send();
}

function getCards(){
    ajaxGetMock("api/deck/13", x => {
            cards = x;
            currentCard = 0;
            update();
        }
    );
}


getCards();


