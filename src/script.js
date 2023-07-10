// Reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes

const FRONT = 0;
const BACK = 1;

class Deck {
    constructor(name){
        this.name = name;
        this.flashcards = [];
        this.currentFlashcard = undefined;
    }

    getFlashcard(i){
        if (i >= this.flashcards.length) {
            throw "oops";
        }
        return this.flashcards[i];
    }
}

class Flashcard {
    constructor(textContentFront, textContentBack){
        this.textContentFront = textContentFront;
        this.textContentBack = textContentBack;
        this.side = FRONT;
    }

    flip(){
        this.side = (this.side+1) % 2;
    }

    getTextContent(){
        return this.side == FRONT ? this.textContentFront : this.textContentBack;
    }
}

class DomHelper {
    constructor(){
        this.flashCardContainer = document.querySelector("#flashCardContainer");
        
    }
    
    addFlashcard(flashcard){
        let newDiv = document.createElement("div");
        newDiv.innerText = flashcard.getTextContent();
        newDiv.style.border = "1px black solid";
        newDiv.style.width = "15em";
        newDiv.style.height = "4em";
        newDiv.style.userSelect = "none";
        newDiv.addEventListener("click", x => { 
            flashcard.flip(); 
            newDiv.innerText = flashcard.getTextContent();
        });
        this.flashCardContainer.appendChild(newDiv);
    }
}

function init(){
    console.log("Yay");

    let domHelper = new DomHelper();
    let fc1 = new Flashcard("Hello", "Hej");
    domHelper.addFlashcard(fc1);
}

init();