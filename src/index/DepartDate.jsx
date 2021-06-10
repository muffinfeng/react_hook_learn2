import './DepartDate.css';
import {h0} from '../common/fp';
import dayJs from 'dayjs';
import PropTypes from 'prop-types';
import React,{useMemo, useEffect} from 'react';

export default function DepartDate(props) {

    const {time, onClick} = props;

    const departh0Date = h0(time);
    const departDate = new Date(departh0Date);

    const isToday = departh0Date === h0();

    const weekString = '周' + ['日','一','二','三','四','五','六'][departDate.getDay] + 
        isToday ? '(今日)' : '' 

    const departDateString = useMemo(() => {
        return dayJs(departh0Date).format('YYYY-MM-DD');
    }, [departh0Date]);


    return (
        <div className="depart-date" onClick={onClick}>
            <input type="hidden" name="date" value={departDateString} />
            {departDateString} <span className="depart-week">{weekString}</span>
        </div>
    );
}

DepartDate.propTypes = {
    time : PropTypes.number.isRequired,
    onClick : PropTypes.func.isRequired
}
