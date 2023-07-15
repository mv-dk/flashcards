from flask import Flask
from redis import Redis

app = Flask(__name__)

@app.route('/')
def index():
    return 'Hello'

@app.route('/login')
def login():
    return 'login'

@app.route('/logout')
def logout():
    return 'logout'

@app.route('/decks')
def get_decks():
    return [{'id':1,'name':'Danish words', 'cards':[]}]

@app.route('/decks/<deckId>')
def get_deck(deckId):
    # add try/catch
    try:
        idNum = int(id)
        return get_decks()[int(id)]
    except:
        return "deck not found", 404

@app.route('/decks/<deckId>/card/<cardId>')
def get_card(deckId, cardId):
    return 'deck, card'
