import CardComponent from "../cardComponent/CardComponent";
import styles from "./CardList.module.css";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useMemo } from "react";

function CardListComponent({
  cards, 
  deleteFunction, 
  columnColor, 
  columnTitle, 
  updateCard, 
  colorList, 
  updateColorList,
  deleteColorFromList,
  addColorToList
  }) {

  // Memoize the items array to prevent unnecessary re-renders
  const cardIds = useMemo(() => cards.map(card => card.id), [cards]);

  return (
    <div className={styles.main}>
      <ul className={styles.cardList}>
        <SortableContext items={cardIds} strategy={verticalListSortingStrategy}>
          {cards.map((elem) => (
            <li className={styles.cardElem} key={elem.id}>
              <CardComponent 
                card={elem} 
                deleteFunction={deleteFunction} 
                key={elem.id} 
                columnColor={columnColor} 
                columnTitle={columnTitle}
                updateCard={updateCard}
                colorList={colorList}
                updateColorList={updateColorList}
                deleteColorFromList={deleteColorFromList}
                addColorToList={addColorToList}
              />
            </li>
          ))}
        </SortableContext>
      </ul>
    </div>
  )
}

export default CardListComponent;