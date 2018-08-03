import React from 'react';
import style from './components.css';
import SeachHintItem from './SearchHintItem';
import Events from './Events';

class SearchResult extends React.Component {
    render() {
        return (
            <div className="card-container">
                <div className={style.tableName}>信用事件</div>
                <SeachHintItem
                    dataMemberItem={this.props.dataMember[0]}
                    isOdd={false}
                />
                <div style={{ padding: '0 24px' }}>
                    <Events
                        filtrateAdd={this.props.filtrateAdd}
                        filtrateMinus={this.props.filtrateMinus}
                        selectedAddlist={this.props.selecedAddEvent}
                        selectedMinuslist={this.props.selecedMinusEvent}
                        addList={this.props.eventsListAdd}
                        minusList={this.props.eventsListMinus}
                        scoreAdd={this.props.scoreListAdd}
                        scoreMinus={this.props.scoreListMinus}
                        searchTable={true}
                        submitDone={this.props.submitDone}
                    />
                </div>
            </div>
        );
    }
}
export default SearchResult;
