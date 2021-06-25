import { connect } from 'react-redux';
import React, { useCallback, useEffect, useMemo } from 'react';
import './App.css';
import Nav from '../common/Nav.jsx';
import List from './List.jsx';
import Bottom from './Bottom.jsx';
import Header from '../common/Header';
import URI from 'urijs';
import { h0 } from '../common/fp';
import dayjs from 'dayjs';
import useNav from '../common/useNav';

import {
    setFrom,
    setTo,
    setDepartDate,
    setHighSpeed,
    setSearchParsed,
    setTrainList,
    setTicketTypes,
    setTrainTypes,
    setDepartStations,
    setArriveStations,
    toggleIsFiltersVisible,
    toggleOnlyTickets,
    toggleOrderType,
    toggleHighSpeed,
    setDepartTimeStart,
    setDepartTimeEnd,
    setArriveTimeStart,
    setArriveTimeEnd,
    nextDate,
    prevDate,
} from './actions';
import { bindActionCreators } from 'redux';

function App(props) {
    const {
        trainList,
        from,
        to,
        departDate,
        highSpeed,
        searchParsed,
        dispatch,
        orderType,
        onlyTickets,
        isFiltersVisible,
        ticketTypes,
        trainTypes,
        departStations,
        arriveStations,
        checkedTicketTypes,
        checkedTrainTypes,
        checkedDepartStations,
        checkedArriveStations,
        departTimeStart,
        departTimeEnd,
        arriveTimeStart,
        arriveTimeEnd,
    } = props;

    const back = useCallback(() => {
        window.history.back();
    }, []);

    useEffect(() => {
        const queries = URI.parseQuery(window.location.search);

        const { from, to, date, highSpeed } = queries;

        dispatch(setFrom(from));
        dispatch(setTo(to));
        dispatch(setDepartDate(h0(dayjs(date)).valueOf()));
        dispatch(setHighSpeed(highSpeed === 'true'));

        dispatch(setSearchParsed(true));
    }, []);

    useEffect(() => {
        if (!searchParsed) {
            return;
        }
        const url = new URI('/rest/query')
            .setSearch('from', from)
            .setSearch('to', to)
            .setSearch('date', dayjs(departDate).format('YYYY-MM-DD'))
            .setSearch('highSpeed', highSpeed)
            .setSearch('orderType', orderType)
            .setSearch('onlyTickets', onlyTickets)
            .setSearch(
                'checkedTicketTypes',
                Object.keys(checkedTicketTypes).join()
            )
            .setSearch(
                'checkedTrainTypes',
                Object.keys(checkedTrainTypes).join()
            )
            .setSearch(
                'checkedDepartStations',
                Object.keys(checkedDepartStations).join()
            )
            .setSearch(
                'checkedArriveStations',
                Object.keys(checkedArriveStations).join()
            )
            .setSearch('departTimeStart', departTimeStart)
            .setSearch('departTimeEnd', departTimeEnd)
            .setSearch('arriveTimeStart', arriveTimeStart)
            .setSearch('arriveTimeEnd', arriveTimeEnd)
            .toString();

        fetch(url)
            .then(result => result.json())
            .then(json => {
                const {
                    dataMap: {
                        directTrainInfo: {
                            trains,
                            filter: {
                                ticketType,
                                trainType,
                                depStation,
                                arrStation,
                            },
                        },
                    },
                } = json;

                dispatch(setTrainList(trains));
                dispatch(setTicketTypes(ticketType));
                dispatch(setTrainTypes(trainType));
                dispatch(setDepartStations(depStation));
                dispatch(setArriveStations(arrStation));
            });
    }, [
        from,
        to,
        departDate,
        highSpeed,
        searchParsed,
        orderType,
        onlyTickets,
        checkedTicketTypes,
        checkedTrainTypes,
        checkedDepartStations,
        checkedArriveStations,
        departTimeStart,
        departTimeEnd,
        arriveTimeStart,
        arriveTimeEnd,
    ]);

    const {
        isPrevDisable,
        isNextDisable,
        prev,
        next
    } = useNav(departDate, dispatch, prevDate, nextDate);//自定義hook
    
    const bottomCbs = useMemo(() => {
        return bindActionCreators({
            toggleIsFiltersVisible,
            toggleOnlyTickets,
            toggleOrderType,
            toggleHighSpeed,
            setTicketTypes,
            setTrainTypes,
            setDepartStations,
            setArriveStations,
            setDepartTimeStart,
            setDepartTimeEnd,
            setArriveTimeStart,
            setArriveTimeEnd,
        },dispatch)
    },[]);

    if (!searchParsed) {
        return null;
    }

    return (
        <div>
            <div className="header-wrapper">
                <Header title={`${from} ⇀ ${to}`} onBack={back} />
            </div>
            <Nav 
                departDate={departDate}
                prev={prev}
                next={next}
                isPrevDisable={isPrevDisable}
                isNextDisable={isNextDisable}
            />
            <List list={trainList}/>
            <Bottom 
                orderType={orderType}
                highSpeed={highSpeed}
                onlyTickets={onlyTickets}
                isFiltersVisible={isFiltersVisible}

                ticketTypes={ticketTypes}
                trainTypes={trainTypes}
                departStations={departStations}
                arriveStations={arriveStations}
                checkedTicketTypes={checkedTicketTypes}
                checkedTrainTypes={checkedTrainTypes}
                checkedDepartStations={checkedDepartStations}
                checkedArriveStations={checkedArriveStations}
                departTimeStart={departTimeStart}
                departTimeEnd={departTimeEnd}
                arriveTimeStart={arriveTimeStart}
                arriveTimeEnd={arriveTimeEnd}
                {...bottomCbs}
            />
        </div>
    );
}

export default connect(
    function mapStateToProps(state) {
        return state;
    },
    function mapDispatchToProps(dispatch) {
        return { dispatch };
    }
)(App);
