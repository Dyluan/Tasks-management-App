import { useState, useEffect } from "react"
import CardComponent from "../cardComponent/CardComponent";
import styles from "./CardList.module.css";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";

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

  const [cardList, setCardList] = useState(cards);

  useEffect(() => {
    setCardList(cards);
  }, [cards]);

  return (
    <div className={styles.main}>
      <ul className={styles.cardList}>
        <SortableContext items={cards.map(card => card.id)} strategy={verticalListSortingStrategy}>
          {cardList.map((elem) => (
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