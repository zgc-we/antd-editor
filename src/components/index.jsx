import RJImgUploader from './RJImgUploader';
import RJPagination from './RJPagination';
import RJSelect from './RJSelect';
import RJMenu from './RJMenu';


var antd = require('antd');

Object.assign(antd, {
    RJImgUploader,
    RJPagination,
    RJSelect,
    RJMenu
});
module.exports = antd;
