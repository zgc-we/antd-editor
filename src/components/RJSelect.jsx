import React from 'react';
import { Select } from 'antd';

const Option = Select.Option;

class RJSelect extends React.Component {
    constructor() {
        super();
    }

    /**
     * 获取 Option Jsx 组件数组
     * @return [type] [description]
     */
    _getOptions(data) {
        if (Array.isArray(data) && data.length > 0) {
            return data.map((item, index) => {
                if (typeof item !== 'object') {
                    return (
                        <Option key={index} value={item}>
                            {item}
                        </Option>
                    );
                }

                return (
                    <Option key={index} value={item.key || item.value || index}>
                        {item.value}
                    </Option>
                );
            });
        } else {
            console.warn('Warnnig: selectData must be Array');
            return null;
        }
    }

    render() {
        let selectData = this.props.selectData;
        let options = this._getOptions(selectData);

        return <Select {...this.props}>{options}</Select>;
    }
}

export default RJSelect;
