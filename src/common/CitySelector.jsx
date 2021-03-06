import React, { useEffect, useMemo, memo, useState, useCallback } from 'react';
import classnames from 'classnames';
import './CitySelector.css';
import PropTypes, { array } from 'prop-types';

const SuggestItem = memo(function SuggestItem(props) {
    const { name, onClick } = props;

    return (
        <li className="city-suggest-li" onClick={() => onClick(name)}>
            {name}
        </li>
    );
});

SuggestItem.propTypes = {
    name: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
};

const Suggest = memo(function Suggest(props) {
    const { searchKey, onClick } = props;

    const [result, setResult] = useState([]);

    useEffect(() => {
        fetch('/rest/search?key=' + encodeURIComponent(searchKey))
            .then(data => data.json())
            .then(data => {
                const { result: result, searchKey: sKey } = data;

                if (searchKey === sKey) {
                    //保证是同一个请求
                    setResult(result);
                }
            });
    }, [searchKey]);

    const cbResult = useMemo(() => {
        if (result.length === 0) {
            return [
                {
                    display: searchKey,
                },
            ];
        } else {
            return result;
        }
    }, [searchKey, result]);

    return (
        <div className="city-suggest">
            <ul className="city-suggest-ul">
                {cbResult.map(item => {
                    return (
                        <SuggestItem
                            key={item.display}
                            name={item.display}
                            onClick={onClick}
                        />
                    );
                })}
            </ul>
        </div>
    );
});

Suggest.propTypes = {
    searchKey: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
};

const CityItem = memo(function CityItem(props) {
    const { onSelect, name } = props;

    return (
        <li className="city-li" onClick={() => onSelect(name)}>
            {name}
        </li>
    );
});

CityItem.propTypes = {
    name: PropTypes.string.isRequired,
    onSelect: PropTypes.func.isRequired,
};

const CitySection = memo(function CitySection(props) {
    const { title, cities = [], onSelect } = props;

    return (
        <ul className="city-ul">
            <li className="city-li" key="title" data-cate={title}>
                {title}
            </li>
            {cities.map(city => {
                return (
                    <CityItem
                        key={city.name}
                        name={city.name}
                        onSelect={onSelect}
                    />
                );
            })}
        </ul>
    );
});

CitySection.propTypes = {
    title: PropTypes.string.isRequired,
    onSelect: PropTypes.func.isRequired,
    cities: PropTypes.array,
};

const AlphaIndex = memo(function AlphaIndex(props) {
    const { alpha, onClick } = props;

    return (
        <i className="city-index-item" onClick={() => onClick(alpha)}>
            {alpha}
        </i>
    );
});

const alphabet = Array.from(new Array(26), (ele, index) => {
    return String.fromCharCode(65 + index);
});

const CityList = memo(function CityList(props) {
    const { sections, onSelect, toAlpha } = props;

    return (
        <div className="city-list">
            <div className="city-cate">
                {sections.map(section => {
                    return (
                        <CitySection
                            key={section.title}
                            onSelect={onSelect}
                            title={section.title}
                            cities={section.citys}
                        />
                    );
                })}
            </div>
            <div className="city-index">
                {alphabet.map(alpha => {
                    return (
                        <AlphaIndex
                            key={alpha}
                            alpha={alpha}
                            onClick={toAlpha}
                        />
                    );
                })}
            </div>
        </div>
    );
});

CityList.propTypes = {
    onSelect: PropTypes.func.isRequired,
    sections: PropTypes.array,
};

const CitySelector = memo(function CitySelector(props) {
    const {
        show,
        isDataLoading,
        cityData,
        onBack,
        fetchCityData,
        onSelect,
    } = props;

    const [keyword, setKeyword] = useState('');

    const key = useMemo(() => {
        return keyword.trim();
    }, [keyword]);

    useEffect(() => {
        if (!show || isDataLoading || cityData) {
            return;
        }
        fetchCityData();
    }, [show, isDataLoading, cityData]);

    const toAlpha = useCallback(alpha => {
        document.querySelector(`[data-cate='${alpha}']`).scrollIntoView();
    }, []);

    const outputCitySections = () => {
        if (isDataLoading) {
            return <div>Loading</div>;
        }

        if (cityData) {
            return (
                <CityList
                    sections={cityData.cityList}
                    onSelect={onSelect}
                    toAlpha={toAlpha}
                />
            );
        }
    };

    return (
        <div className={classnames('city-selector', { hidden: !show })}>
            <div className="city-search">
                <div className="search-back" onClick={() => onBack()}>
                    <svg width="42" height="42">
                        <polyline
                            points="25,13 16,21 25,29"
                            stroke="#fff"
                            strokeWidth="2"
                            fill="none"
                        />
                    </svg>
                </div>
                <div className="search-input-wrapper">
                    <input
                        type="text"
                        value={key}
                        className="search-input"
                        placeholder="城市、车站的中文或拼音"
                        onChange={e => {
                            setKeyword(e.target.value);
                        }}
                    />
                </div>
                <i
                    onClick={() => {
                        setKeyword('');
                    }}
                    className={classnames('search-clean', {
                        hidden: key.length === 0,
                    })}
                >
                    &#xf063;
                </i>
            </div>
            {Boolean(key) && (
                <Suggest searchKey={key} onClick={key => onSelect(key)} />
            )}
            {outputCitySections()}
        </div>
    );
});

CitySelector.propTypes = {
    show: PropTypes.bool.isRequired,
    cityData: PropTypes.object,
    isDataLoading: PropTypes.bool.isRequired,
    onBack: PropTypes.func.isRequired,
    fetchCityData: PropTypes.func.isRequired,
    onSelect: PropTypes.func.isRequired,
};

export default CitySelector;
