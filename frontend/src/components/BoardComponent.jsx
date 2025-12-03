import ColumnListComponent from "./ColumnListComponent";
import { useState } from "react";

function BoardComponent() {

  const [columns, setColumns] = useState(0);

  function handleClick () {
    alert('bouton cliqued');
  }
  return (
    <div className="container">
      <div className="title">
        <h1>My Board</h1>
      </div>
      <div className="main">
        <ColumnListComponent />
        <p>
          <button onClick={handleClick}>click to add a column</button>
        </p>
      </div>
    </div>
  )
}

export default BoardComponent;