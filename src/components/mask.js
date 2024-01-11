import {colors} from '../styles/colors';
import '../styles/animation.css';

export function Mask(props){
    return(
        <div className='fadeInUp' style={styles.modalContainer}>
            <div style={styles.modalMask} onClick={props.maskClosable ? props.onClose.bind(this) : null}>
                {props.children}
            </div>
        </div>
    )
}

const styles = {
    modalContainer:{
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalMask:{
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        backgroundColor: colors.primary.dark,
        zIndex: 998
    },
}