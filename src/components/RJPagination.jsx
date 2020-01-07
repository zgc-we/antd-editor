import React from 'react';
import { Pagination } from 'antd';

class RJPagination extends React.Component {
    constructor() {
        super();
    }

    render() {
        let pageData = this.props.pageData;

        return (
            <Pagination
                current={pageData.currentIndex}
                pageSize={pageData.pageSize}
                total={pageData.totalNumber}
                onChange={this.props.onChange}
            />
        );
    }
}

export default RJPagination;
