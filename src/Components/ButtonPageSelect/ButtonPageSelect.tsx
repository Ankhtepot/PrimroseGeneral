import styles from './ButtonPageSelect.module.scss';
import {ArrowBigRight} from "lucide-react";
import {Link} from "react-router-dom";

type ButtonPageSelectProps = {
    text: string;
    linkTo: string;
    className?: string;
    onClick?: () => void;
    active?: boolean;
}

function ButtonPageSelect(props: ButtonPageSelectProps) {
  return (
      <Link to={props.linkTo} className={`${styles.button} ${props.className} ${props.active ? styles.active : ''}`}>
          <div className={styles.content}>
              {props.text}
              <ArrowBigRight className={styles.icon}/>
          </div>
      </Link>
  );
}

export default ButtonPageSelect;