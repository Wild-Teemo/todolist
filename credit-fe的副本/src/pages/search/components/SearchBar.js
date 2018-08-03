import React from 'react';
import style from './components.css';
import searchIcon from '../../../assets/images/searchIcon.png';
import searchBtn from '../../../assets/images/searchBtn.png';
// import {Icon } from 'antd';
class SearchBar extends React.Component {
    constructor() {
        super();
        this.clickHandler = this.clickHandler.bind(this);
    }
    clickHandler() {
        let tep = document.getElementsByTagName('input')[0].value;
        let str = { key: 'Enter', target: { value: tep } };
        this.props.keyPressHandler(str);
    }
    render() {
        return (
            <div>
                <div
                    className={
                        this.props.isLarge === 1
                            ? style.searchBarL
                            : style.searchBarS
                    }
                >
                    <input
                        className={
                            this.props.isLarge === 1
                                ? style.searchInputL
                                : style.searchInputS
                        }
                        placeholder={'请输入姓名查询'}
                        onKeyPress={this.props.keyPressHandler}
                    />
                    <button
                        className={
                            this.props.isLarge === 1
                                ? style.searchBtnL
                                : style.searchBtnS
                        }
                        onClick={this.clickHandler}
                        style={{ background: searchBtn }}
                    >
                        <img src={searchIcon} alt="Search" />
                    </button>
                </div>
            </div>
        );
    }
}

export default SearchBar;
