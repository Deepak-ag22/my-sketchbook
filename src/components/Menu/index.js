import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPencil,faEraser,faRotateLeft,faRotateRight,faFileArrowDown } from "@fortawesome/free-solid-svg-icons"
import styles from "./index.module.css"
import { useDispatch ,useSelector} from "react-redux"
import cx from 'classnames'
import { MENUITEMS } from "@/constants"
import { menuItemclick,actionItemclick } from "@/slice/menuSlice"
const Menu = () => {
    const dispatch = useDispatch()
    const activeMenuItem = useSelector((state) => state.menu.activeMenuItem)
    const handlemenuClick = (itemName) => {
        dispatch(menuItemclick(itemName))
    }
    const handleActionItemClick = (itemName) => {
        dispatch(actionItemclick(itemName));
    }
   return(
    <div className={styles.menuContainer}>
        <div className={cx(styles.iconWrapper,{[styles.active]:activeMenuItem===MENUITEMS.PENCIL})} onClick={()=>handlemenuClick(MENUITEMS.PENCIL)}>
            <FontAwesomeIcon icon={faPencil} className={styles.icon} />
        </div> 
        <div className={cx(styles.iconWrapper,{[styles.active]:activeMenuItem===MENUITEMS.ERASER})} onClick={()=>handlemenuClick(MENUITEMS.ERASER)}>
            <FontAwesomeIcon icon={faEraser} className={styles.icon} />
        </div>
        <div className={styles.iconWrapper} onClick={()=>handleActionItemClick(MENUITEMS.UNDO)}>
            <FontAwesomeIcon icon={faRotateLeft} className={styles.icon}/>
        </div>
        <div className={styles.iconWrapper} onClick={()=>handleActionItemClick(MENUITEMS.REDO)}>
            <FontAwesomeIcon icon={faRotateRight} className={styles.icon}/>
        </div>
        <div className={styles.iconWrapper} onClick={()=>handleActionItemClick(MENUITEMS.DOWNLOAD)}>
            <FontAwesomeIcon icon={faFileArrowDown} className={styles.icon}/>
        </div>
   </div>)
}
export default Menu;