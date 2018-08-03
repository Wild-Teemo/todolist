import React from 'react';
import SearchBar from '../../../components/SearchBar/SearchBar';
import { DatePicker } from 'antd';
// import moment from 'moment';
import style from './components.css';
import 'moment/locale/zh-cn';
// import { formatDate } from '../../../utils/mytool';

const { MonthPicker } = DatePicker;
// const monthFormat = 'YYYY年MM月';

function HeaderSearch(props) {
    let search = userId => {
        props.userSearch(userId);
    };
    // let localDate = formatDate('yyyy年MM月', new Date());

    let onChange = (date, chooseDate) => {
        // if (chooseDate === '') {
        //     chooseDate = localDate;
        // }
        props.dateSearch(chooseDate);
    };
    const globalUserId = value => {
        props.globalUserId(value);
    };
    return (
        <div className={style.HeaderTop}>
            <div className={style.datePick}>
                <MonthPicker
                    size="large"
                    showTime
                    placeholder="全部时间"
                    onChange={onChange}
                    // defaultValue={moment(localDate, monthFormat)}
                    // format={monthFormat}
                />
            </div>
            <div className={style.searchBar}>
                <SearchBar
                    search={search}
                    globalUserId={globalUserId}
                    style={{ width: 276 }}
                />
            </div>
        </div>
    );
}

export default HeaderSearch;
