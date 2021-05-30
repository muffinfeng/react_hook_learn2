import React, { useMemo, useState } from 'react';
import classnames from 'classnames';
import './CitySelector.css';

export default function CitySelector(props) {
    const { show, isDataLoading, cityData, onBack } = props;

    const [keyword, setKeyword] = useState('');

    const key = useMemo(() => {
        return keyword.trim();
    }, [keyword]);

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
        </div>
    );
}
