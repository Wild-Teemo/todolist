import React from 'react';
import SearchBar from '../../../components/SearchBar/SearchBar';
import { DatePicker } from 'antd';
// import moment from 'moment';
import style from './components.css';
// import 'moment/locale/zh-cn';

const { MonthPicker } = DatePicker;
// const monthFormat = 'YYYY年MM月';

function HeaderSearch(props) {
    const search = userId => {
        props.search(userId);
    };
    const globalUserId = value => {
        props.globalUserId(value);
    };
    const timeChange = (date, dateString) => {
        if (dateString === '') {
            // return;
            props.changeTime();
        } else {
            let searchDate = dateString.replace('年', '-');
            searchDate = searchDate.replace('月', '');
            props.changeTime(searchDate);
        }
    };

    return (
        <div className={style.HeaderTop}>
            <div className={style.datePick}>
                <MonthPicker
                    size="large"
                    placeholder="全部时间"
                    // defaultValue={moment(props.current, monthFormat)}
                    //初始不需要默认值为当前时间 直接获取全部
                    onChange={timeChange}
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
