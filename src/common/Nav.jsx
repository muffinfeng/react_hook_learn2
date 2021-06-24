import React,{useMemo,memo} from 'react';
import './Nav.css';
import PropTypes from 'prop-types';
import { h0 } from './fp';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import classnames from 'classnames';

const Nav = memo(function Nav(props) {
    const {departDate, prev, next, isPrevDisable, isNextDisable} = props;

    const currentString = useMemo(() => {
        const d = dayjs(departDate);
        return d.format('M月D日  ') + d.locale('zh-cn').format('ddd');

    }, [departDate]);

    return (
        <div className="nav">
            <span
                className={classnames('nav-prev',{
                    'nav-disable' : isPrevDisable
                })}
                onClick={prev}
            >
                前一天
            </span>
            <span className="nav-current">{currentString}</span>
            <span
                className={classnames('nav-next',{
                    'nav-disable' : isNextDisable
                })}
                onClick={next}
            >
                后一天
            </span>
        </div>
    )
    

});

export default Nav;

Nav.PropTypes = {
    departDate: PropTypes.number.isRequired,
    prev: PropTypes.func.isRequired, 
    next: PropTypes.func.isRequired, 
    isPrevDisable: PropTypes.bool.isRequired, 
    isNextDisable: PropTypes.bool.isRequired
}