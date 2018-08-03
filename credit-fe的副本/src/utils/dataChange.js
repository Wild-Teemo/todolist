//用于数据展示的公共函数
// export default function dataChange(arr) {
//     if (arr.length !== 0) {
//         let newarr = arr.map((ele, index) => {
//             let data = {};
//             data.key = ele.id;
//             data.title = ele.title;
//             switch (ele.score) {
//                 case 0:
//                     data.result = '评分中';
//                     break;
//                 case 1:
//                     data.result = '大';
//                     break;
//                 case 2:
//                     data.result = '中';
//                     break;
//                 case 3:
//                     data.result = '小';
//                     break;
//                 case 4:
//                     data.result = '无效';
//                     break;
//                 default:
//                     data.result = '未定义';
//                     break;
//             }
//             return data;
//         });
//         return newarr;
//     } else {
//         return [];
//     }
// }
export default function dataChange(arr) {
    if (arr.length !== 0) {
        let newarr = arr.map((ele, index) => {
            let data = {};
            data.key = ele.id;
            data.title = ele.title;
            switch (ele.score) {
                case -2:
                    data.result = '评分中';
                    break;
                case -1:
                    data.result = '已失效';
                    break;
                default:
                    data.result = ele.score.toString();
                    break;
            }
            return data;
        });
        return newarr;
    } else {
        return [];
    }
}
