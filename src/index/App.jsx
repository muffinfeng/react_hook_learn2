import React, { useCallback, useMemo } from 'react';
import { connect } from 'react-redux';
import './App.css';

import Header from '../common/Header';
import DepartDate from './DepartDate';
import HighSpeed from './HighSpeed';
import Journey from './Journey';
import Submit from './Submit';
import CitySelector from '../common/CitySelector';
import { bindActionCreators } from 'redux';

import {
    exchangeFromAndTo,
    showCitySelector,
    hideCitySelector,
    fetchCityData,
    setSelectedCity,
    showDateSelector,
    hideDateSelector,
    setDepartDate,
    toggleHighSpeed,
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
            },
            dispatch
        );
    }, []);

    return (
        <div>
            <div className="header-wrapper">
                <Header onBack={onBack} title="火车票" />
            </div>
            <form>
                <Journey from={from} to={to} {...cbs} />
                <DepartDate />
                <HighSpeed />
                <Submit />
            </form>
            <CitySelector
                isDataLoading={isLoadingCityData}
                show={isCitySelectorVisible}
                cityData={cityData}
                {...citySelectorCbs}
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
