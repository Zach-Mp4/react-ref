import React, { useState, useEffect } from "react";
import axios from "axios";
import Card from "./Card.js"
const API_BASE_URL = "https://deckofcardsapi.com/api/deck";

function Deck(){
    const [deck, setDeck] = useState(null);
    const [drawn, setDrawn] = useState([]);
    const [isShuffling, setIsShuffling] = useState(false);

    useEffect(function loadDeck() {
        async function fetchData() {
          const d = await axios.get(`${API_BASE_URL}/new/shuffle/`);
          setDeck(d.data);
        }
        fetchData();
    }, []);

    async function draw() {
        try {
            const drawRes = await axios.get(`${API_BASE_URL}/${deck.deck_id}/draw/`);

            if (drawRes.data.remaining === 0) throw new Error("Deck empty!");

            const card = drawRes.data.cards[0];

            setDrawn(d => [
                ...d,
                {
                  id: card.code,
                  name: card.suit + " " + card.value,
                  image: card.image,
                },
            ]);

        } catch (err){
            alert(err);
        }
    }

    async function shuffling() {
        setIsShuffling(true);
        try {
          await axios.get(`${API_BASE_URL}/${deck.deck_id}/shuffle/`);
          setDrawn([]);
        } catch (err) {
          alert(err);
        } finally {
          setIsShuffling(false);
        }
    }

    function renderShuffleBtnIfOk() {
        if (!deck) return null;
        return (
          <button
            className="Deck-gimme"
            onClick={shuffling}
            disabled={isShuffling}>
            SHUFFLE DECK
          </button>
        );
      }

    function renderDrawBtnIfOk() {
        if (!deck) return null;
    
        return (
          <button
            className="Deck-gimme"
            onClick={draw}
            disabled={isShuffling}>
            DRAW
          </button>
        );
    }

    return (
        <main className="Deck">
    
          {renderDrawBtnIfOk()}
          {renderShuffleBtnIfOk()}
          <div>{
            drawn.map(c => (
                <Card key={c.id} name={c.name} />
              ))}
          </div>
    
        </main>
      );

}

export default Deck;