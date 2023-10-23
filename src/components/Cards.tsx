import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import "./styles/Card.scss";

interface Props {
  cards: Array<{
    id: number;
    palo: string;
    value?: number;
  }>;
}

interface Card {
  id: number;
  palo: string;
  value?: number;
}

/*
  Con respecto a estas dos funciones, es la unica solucion
  que pude encontrar para usar el hook useSortable dentro del callback.
*/

// Se encarga de usar el hook y configura la base + estilado de cuando se agarra la tarjeta
function SortableHookRendererInner({ id, palo, value }: Card) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: id,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      style={style}
      className={`card ${palo.toLowerCase()}`}
      {...attributes}
      {...listeners}
      ref={setNodeRef}
    >
      {value !== -1 ? <p>{value}</p> : <p></p>}
      {palo}
      {value !== -1 ? <p>{value}</p> : <p></p>}
    </div>
  );
}

// Llama a la funcion anterior por cada carta en el arreglo y la configura
function SortableHookRenderer({ cards }: Props) {
  return (
    <div className="cards-container">
      {cards.map((card) => (
        <SortableHookRendererInner
          key={card.id}
          id={card.id}
          palo={card.palo}
          value={card.value}
        />
      ))}
    </div>
  );
}

// Componente principal
export default function Cards({ cards }: Props) {
  return <SortableHookRenderer cards={cards} />;
}
