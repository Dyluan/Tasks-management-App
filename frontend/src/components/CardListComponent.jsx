import { useState, useEffect } from "react"
import CardComponent from "./CardComponent";
import styles from "./CardList.module.css";

function CardListComponent({cards}) {

  const [cardList, setCardList] = useState(cards);

  useEffect(() => {
    setCardList(cards);
  }, [cards]);

  // doesnt work yet as I have to rework the items
  const deleteItems = (index) => {
    setCardList(prev => prev.filter())
  }

  return (
    <div className={styles.main}>
      <ul className={styles.cardList}>
        {cardList.map((elem, index) => (
          <li className={styles.cardElem} key={index}>
            <CardComponent cardText={elem} index={index}/>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default CardListComponent;