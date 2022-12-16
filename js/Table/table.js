import { TABLE_VIEW } from "../view";
import { newElement, addToTarget } from "../utility/util";

const paragraph = newElement("p");
paragraph.innerText = "This is para";

addToTarget(paragraph, TABLE_VIEW);
