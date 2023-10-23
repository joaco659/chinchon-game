import { useState } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";

import "./App.scss";

import Cards from "./components/Cards";

import CARDS_LIST from "./CardsList";

interface Card {
  id: number;
  palo: string;
  value: number;
}

// Obtener numeros random
function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Mezcla las cartas, devolviendo un array de cartas que no se repite
function shuffleCards(count: number): Card[] {
  const selectedIndexes = new Set();
  const resultArray = [];

  while (selectedIndexes.size < count) {
    const randomIndex = getRandomNumber(0, CARDS_LIST.length - 1);
    if (!selectedIndexes.has(randomIndex)) {
      selectedIndexes.add(randomIndex);
      resultArray.push(CARDS_LIST[randomIndex]);
    }
  }

  return resultArray;
}

function checkCards(cards: Card[]): void {
  let cardSequence: number = 1;
  let cardActualJuego: Card[] = [];

  // let isJuegoOfSameValue: boolean;

  // const cardJuegos: Array<Card[]> = [];

  cards.map((card: Card, i: number) => {
    const bCard: Card = cards[i + 1];

    if (bCard) {
      if (
        // Comodin izq.
        card.value === -1 ||
        // Comodin der.
        bCard.value === -1 ||
        card.value === bCard.value ||
        card.value + 1 === bCard.value ||
        card.value - 1 === bCard.value ||
        Math.abs(card.value - bCard.value) === 1
      ) {
        if (
          card.value === bCard.value &&
          card.palo !== bCard.palo
        ) {
          // isJuegoOfSameValue = true;
          console.log("AWAWAWAW");
          return;
        }

        cardSequence++;
        cardActualJuego.push(card, bCard);

        if (cardSequence >= 2) {
          console.log(
            `Secuencia de 2 encontrada entre las cartas ${card.palo} ${card.value} y ${bCard.palo} ${bCard.value}`
          );
        }
        if (cardSequence >= 3) {
          console.log(new Set(cardActualJuego));

          console.log(
            `Secuencia de 3 encontrada entre las cartas ${cardActualJuego[0].palo} ${cardActualJuego[0].value}, ${cardActualJuego[1].palo} ${cardActualJuego[1].value} y ${cardActualJuego[3].palo} ${cardActualJuego[3].value}`
          );
        }
      } else {
        cardSequence = 1;
        cardActualJuego = [];
      }
    }
  });
}

function App() {
  const [cards, setCards] = useState<Card[]>(shuffleCards(7));

  // Maneja cuando una carta se suelta sobre otra, modificando el estado del arreglo de cartas
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function handleCardDragEnd(event: { active: any; over: any }) {
    const { active, over } = event;
    if (active && over) {
      setCards((cards) => {
        const oldIndex = cards.findIndex((card) => card.id === active.id);
        const newIndex = cards.findIndex((card) => card.id === over.id);
        const newCardOrder = arrayMove(cards, oldIndex, newIndex);
        checkCards(newCardOrder);
        return newCardOrder;
      });
    }
  }

  return (
    <>
      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={handleCardDragEnd}
      >
        <SortableContext items={cards} strategy={horizontalListSortingStrategy}>
          <Cards cards={cards} />
        </SortableContext>
      </DndContext>
    </>
  );
}

export default App;
