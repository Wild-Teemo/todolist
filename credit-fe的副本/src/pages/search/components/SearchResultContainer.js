import React from 'react';
import style from './components.css';
import SeachHintItem from './SearchHintItem';
import SearchResult from './SearchResult';
import SearchBar from './SearchBar';
import dataBlank from './../../../assets/images/dataBlank.png';

class SearchResultContainer extends React.Component {
    render() {
        let flag = this.props.searchBarFlag === true ? 0 : 1;
        if (this.props.reFlag === true) {
            flag = 2;
        }
        switch (flag) {
            case 1:
                return (
                    <div>
                        <div className={style.searchBarCon}>
                            <SearchBar
                                keyPressHandler={this.props.keyPressHandler}
                                isLarge={2}
                            />
                        </div>

                        {this.props.dataMember.length === 0 ? (
                            <div className={style.resultContainer2}>
                                <div className={style.centerBlankBox}>
                                    <img
                                        className={style.imgBlock}
                                        src={dataBlank}
                                        alt="暂无内容"
                                    />
                                    <p>抱歉，没有找到您搜索的内容</p>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <div className={style.tableName}>基本资料</div>
                                <div
                                    className={style.resultContainer}
                                    onClick={this.props.clickitemhandler}
                                >
                                    {this.props.dataMember.map((val, index) => {
                                        return (
                                            <SeachHintItem
                                                key={index}
                                                dataMemberItem={val}
                                                isOdd={index % 2 !== 0}
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                );

            case 2:
                return (
                    <div>
                        <div className={style.searchBarCon}>
                            <SearchBar
                                keyPressHandler={this.props.keyPressHandler}
                                isLarge={2}
                            />
                        </div>
                        <div className={style.resultContainer}>
                            <SearchResult
                                filtrateAdd={this.props.filtrateAdd}
                                filtrateMinus={this.props.filtrateMinus}
                                dataMember={this.props.dataMember}
                                eventsListAdd={this.props.eventsListAdd}
                                eventsListMinus={this.props.eventsListMinus}
                                selecedAddEvent={this.props.selecedAddEvent}
                                selecedMinusEvent={this.props.selecedMinusEvent}
                                scoreListAdd={this.props.scoreListAdd}
                                scoreListMinus={this.props.scoreListMinus}
                                submitDone={this.props.submitDone}
                            />
                        </div>
                    </div>
                );

            default:
                return (
                    <div className={style.centerBox}>
                        <SearchBar
                            keyPressHandler={this.props.keyPressHandler}
                            isLarge={1}
                        />
                    </div>
                );
        }
    }
}

export default SearchResultContainer;
