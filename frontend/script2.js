let currentDeck = createDeckObj(0,"",[]);

let cards = [
    createCardObj("Hej", "Hello"),
    createCardObj("En bil", "a car")
];
let currentCard = 0;

function createDeckObj(id, name, cards){
    return ({
        id: id,
        name: name,
        cards: cards
    });
}

function createCardObj(front, back){
    return ({
        front: front,
        back: back
    });
}

/*
  Clonesthe node with id given by templateId, and gives it a new id newId, 
  and appends the clone in the node with id parentId.
 */
function insertFromTemplate(templateId, newId, parentId){
    let newNode = document.querySelector("#"+templateId).cloneNode();
    newNode.id = newId;
    newNode.style.display = "";
    document.querySelector("#"+parentId).appendChild(newNode);
    return newNode;
}

function showCard(card){
    let container = document.querySelector("#flashCardContainer");
    let cardDiv = container.querySelector("#card");
    if (cardDiv == undefined || cardDiv == null){
        cardDiv = insertFromTemplate("card_template", "card", "flashCardContainer");
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

function deleteButton(e){
    deleteCard(currentDeck.id, cards[currentCard].id)
}

function newButton(e){
    
}

function update(){ showCard(cards[currentCard]); }



/*****************/
/* api calls     */
/*****************/
SERVER_DICT = {
    "decks":{
        1: [
            createCardObj("Et hus", "a mouse"),
            createCardObj("En mus", "a mouse"),
            createCardObj("Et bord", "a table"),
            createCardObj("En bil", "a car")
        ],
        2: [
            createCardObj("an abstract class cannot be ...", "instantiated"),
            createCardObj("a sealed class cannot be ...", "extended"),
            createCardObj("A class can inherit multiple interfaces?", "true")
        ],
        3: [
            createCardObj("to want", "خواستن"),
            createCardObj("to see", "دیدن"),
            createCardObj("to jump", "پریدن")
        ]
    }
};

function ajaxGetMock(url, okHandler, responseMock){
    console.log(`mock GET ${url}`);
    if (responseMock == undefined){
        if (url.indexOf('api/deck/') != -1){
            responseMock = SERVER_DICT.decks[url.split("/")[2]];
        }
    }
    setTimeout(()=> {
        console.log(`mock response: ${responseMock}`);    
        okHandler(responseMock);
    }, 1000);
}

function ajaxPostMock(url, data, okHandler, responseMock){
    console.log(`mock POST ${url}`);
    setTimeout(()=>{
        console.log(`mock response: ${responseMock}`);
        okHandler(responseMock);
    }, 1000);
}

function ajaxDeleteMock(url, data, okHandler, responseMock){
    console.log(`mock DELETE ${url}`);
    setTimeout(()=>{
        console.log(`mock response: ${responseMock}`);
        okHandler(responseMock);
    }, 1000);
}

function ajaxGet(url, okHandler){
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
        if (xhr.readyState == XMLHttpRequest.DONE){
            if (xhr.status == 200){
                okHandler(xhr.response);
            } else {
                throw `xhr status from GET call to ${url}: ${xhr.status}`;
            }
        }
    };
    xhr.open("GET", url, true);
    xhr.send();
}

function ajaxPost(url, data, okHandler){
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
        if (xhr.readyState == XMLHttpRequest.DONE){
            if (xhr.status == 200) {
                okHandler(xhr.response);
            } else {
                throw `xhr status from POST call to ${url}: ${xhr.status}`;
            }
        }
    };
    xhr.open("POST", url, true);
    xhr.data = data;
    xhr.send();
}

function ajaxDelete(url, data, okHandler){
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
        if (xhr.readyState == XMLHttpRequest.DONE){
            if (xhr.status == 200) {
                okHandler(xhr.response);
            } else {
                throw `xhr status from DELETE call to ${url}: ${xhr.status}`;
            }
        }
    };
    xhr.open("DELETE", url, true);
    xhr.data = data;
    xhr.send();
}

function apiCreateDeck(name){
    ajaxPostMock(`api/deck`, JSON.stringify({name: name}), () => {});
}

function apiAddCard(deckId, card){
    ajaxPostMock(`api/deck/${deckId}/card`, card, () => {}, []);
}

function apiDeleteCard(deckId, cardId){
    ajaxDeleteMock(`api/deck/${deckId}/card/${cardId}`, undefined, () => {
        
        apiGetCards(deckId);
    });
}

function apiGetListOfDecks(){
    ajaxGetMock(
        `api/deck`, 
        decks => {
            let ul = document.querySelector("#decks ul");
            ul.replaceChildren(...decks.map(x => {
                let li = document.createElement("li");
                let a = document.createElement("a");
                a.href = `#`;
                a.onclick = () => apiLoadDeck(x.id);
                a.innerText = x.name;
                li.appendChild(a);
                return li;
            }));
        }, 
        [
            {name:"danish words", id:1},
            {name:"programming concepts", id:2},
            {name:"persian verbs", id:3}
        ]
    );
}

function apiGetCards(deckId){
    ajaxGetMock(`api/deck/${deckId}`, x => {
            cards = x;
            currentCard = 0;
            update();
        }
    );
}

function apiLoadDeck(id){
    ajaxGetMock(`api/deck/${id}/name`, x => {
            currentDeck = {id: id, name: x};
            document.querySelector("h2").innerText = currentDeck.name;
        }, id == 1 ? "danish words" : id == 2 ? "programming concepts" : "persian verbs")
    
    apiGetCards(id);
}

apiGetListOfDecks();

apiLoadDeck(1);

