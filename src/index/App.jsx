import React, { useCallback, useMemo } from 'react';
import { connect } from 'react-redux';
import './App.css';

import Header from '../common/Header';
import DepartDate from './DepartDate';
import HighSpeed from './HighSpeed';
import Journey from './Journey';
import Submit from './Submit';
import CitySelector from '../common/CitySelector';
import DateSelector from '../common/DateSelector';
import { bindActionCreators } from 'redux';
import { h0 } from '../common/fp';

import {
    exchangeFromAndTo,
    showCitySelector,
    hideCitySelector,
    showDateSelector,
    hideDateSelector,
    setDepartDate,
    toggleHighSpeed,
    fetchCityData,
    setSelectCity,
} from './actions';

function App(props) {
    const {
        from,
        to,
        isCitySelectorVisible,
        isDateSelectorVisible,
        cityData,
        isLoadingCityData,
        highSpeed,
        dispatch,
        departDate,
    } = props;

    const onBack = useCallback(() => {
        window.history.back();
    }, []);

    const cbs = useMemo(() => {
        return bindActionCreators(
            {
                exchangeFromAndTo,
                showCitySelector,
            },
            dispatch
        );
    }, []);

    const citySelectorCbs = useMemo(() => {
        return bindActionCreators(
            {
                onBack: hideCitySelector,
                fetchCityData,
                onSelect: setSelectCity,
            },
            dispatch
        );
    }, []);

    const departDateCbs = useMemo(() => {
        return bindActionCreators(
            {
                onClick: showDateSelector,
            },
            dispatch
        );
    }, []);

    const dateSelectorCbs = useMemo(() => {
        return bindActionCreators(
            {
                onBack: hideDateSelector,
            },
            dispatch
        );
    }, []);

    const selectDate = useCallback(date => {
        if (!date) {
            return;
        }

        if (date < h0()) {
            return;
        }

        dispatch(hideDateSelector());
        dispatch(setDepartDate(date));
    }, []);

    const highSpeedCbs = useMemo(() => {
        return bindActionCreators(
            {
                toggle: toggleHighSpeed,
            },
            dispatch
        );
    }, []);

    return (
        <div>
            <div className="header-wrapper">
                <Header onBack={onBack} title="火车票" />
            </div>
            <form action="./query.html" className="form">
                <Journey from={from} to={to} {...cbs} />
                <DepartDate time={departDate} {...departDateCbs} />
                <HighSpeed highSpeed={highSpeed} {...highSpeedCbs} />
                <Submit />
            </form>
            <CitySelector
                isDataLoading={isLoadingCityData}
                show={isCitySelectorVisible}
                cityData={cityData}
                {...citySelectorCbs}
            />
            <DateSelector
                show={isDateSelectorVisible}
                {...dateSelectorCbs}
                onSelect={selectDate}
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
