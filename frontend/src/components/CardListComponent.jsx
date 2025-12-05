import { useState, useEffect } from "react"
import CardComponent from "./CardComponent";
import styles from "./CardList.module.css";

function CardListComponent({cards}) {

  const [cardList, setCardList] = useState(cards);

  useEffect(() => {
    setCardList(cards);
  }, [cards]);

  return (
    <div className={styles.main}>
      <ul className={styles.cardList}>
        {cardList.map((elem) => (
          <li className={styles.cardElem} key={elem.id}>
            <CardComponent card={elem}/>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default CardListComponent;