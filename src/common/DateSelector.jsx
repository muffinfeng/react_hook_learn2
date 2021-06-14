import React from 'react';
import PropTypes from 'prop-types';
import Header from './Header';
import classnames from 'classnames';
import './DateSelector.css';
import { h0 } from '../common/fp';

function Day(props) {
    const { day, onSelect } = props;

    if (!day) {
        return <td className="null"></td>;
    }

    const now = h0();
    const classes = [];

    if (day < now) {
        classes.push('disabled');
    }

    if ([0, 6].includes(new Date(day).getDay())) {
        classes.push('weekend');
    }

    const dateString = now === day ? '今天' : new Date(day).getDate();

    return (
        <td className={classnames(classes)} onClick={() => onSelect(day)}>
            {dateString}
        </td>
    );
}

Day.propTypes = {
    day: PropTypes.number,
    onSelect: PropTypes.func.isRequired,
};

function Week(props) {
    const { week, onSelect } = props;

    return (
        <tr className="date-table-days">
            {week.map((day, idx) => {
                return <Day key={idx} day={day} onSelect={onSelect} />;
            })}
        </tr>
    );
}

Week.propTypes = {
    week: PropTypes.array.isRequired,
    onSelect: PropTypes.func.isRequired,
};

function Month(props) {
    const { startTimeMonth, onSelect } = props;

    const startDay = new Date(startTimeMonth);
    const currentDay = new Date(startTimeMonth);

    let days = [];

    while (currentDay.getMonth() === startDay.getMonth()) {
        days.push(currentDay.getTime());
        currentDay.setDate(currentDay.getDate() + 1);
    }

    days = new Array(startDay.getDay() ? startDay.getDay() - 1 : 6)
        .fill(null)
        .concat(days);

    days = days.concat(
        new Array(currentDay.getDay() ? 7 - currentDay.getDay() + 1 : 0).fill(
            null
        )
    );

    const weeks = [];

    for (var rows = 0; rows < days.length / 7; rows++) {
        const week = days.slice(rows * 7, (rows + 1) * 7);
        weeks.push(week);
    }

    return (
        <table className="date-table">
            <thead>
                <tr>
                    <td colSpan="7">
                        <h5>
                            {startDay.getFullYear()}年{startDay.getMonth() + 1}
                            月
                        </h5>
                    </td>
                </tr>
            </thead>
            <tbody>
                <tr className="data-table-weeks">
                    <th>周一</th>
                    <th>周二</th>
                    <th>周三</th>
                    <th>周四</th>
                    <th>周五</th>
                    <th className="weekend">周六</th>
                    <th className="weekend">周日</th>
                </tr>
                {weeks.map((week, idx) => {
                    return <Week key={idx} week={week} onSelect={onSelect} />;
                })}
            </tbody>
        </table>
    );
}

Month.propTypes = {
    startTimeMonth: PropTypes.number.isRequired,
    onSelect: PropTypes.func.isRequired,
};

export default function DateSelector(props) {
    const { show, onBack, onSelect } = props;

    const monthSequence = [];

    const date = new Date();

    date.setMilliseconds(0);
    date.setSeconds(0);
    date.setMinutes(0);
    date.setHours(0);
    date.setDate(1);

    monthSequence.push(date.getTime());

    date.setMonth(date.getMonth() + 1);
    monthSequence.push(date.getTime());

    date.setMonth(date.getMonth() + 1);
    monthSequence.push(date.getTime());

    return (
        <div className={classnames('date-selector', { hidden: !show })}>
            <Header title="日期选择" onBack={onBack} />
            <div className="date-selector-tables">
                {monthSequence.map(month => {
                    return (
                        <Month
                            key={month}
                            startTimeMonth={month}
                            onSelect={onSelect}
                        />
                    );
                })}
            </div>
        </div>
    );
}

DateSelector.propTypes = {
    show: PropTypes.bool.isRequired,
    onSelect: PropTypes.func.isRequired,
    onBack: PropTypes.func.isRequired,
};
