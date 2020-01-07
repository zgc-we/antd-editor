import React from 'react';
import { Upload, Icon, Modal } from 'antd';

import imageUtil from './es5/image.js';

class RJImgUploader extends React.Component {
    state = {
        fileList: [],
        previewVisible: false,
        previewImage: '',
        updatedDefaultValue: null,
    };

    static propTypes = {
        onChange: React.PropTypes.func.isRequired,
        num: React.PropTypes.number,
        action: React.PropTypes.string.isRequired,
        defaultValue: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.array]),
        onRemove: React.PropTypes.func,
    };

    componentDidMount() {
        let fileList = this.getDefauleFilelist(this.props.defaultValue);
        this.setState({
            fileList: fileList,
        });
    }

    onChange = ({ fileList }) => {
        // 当为done的时候，如果success 为false，不应该加入fileList中
        let files = fileList.filter(
            file => (file.status === 'done' && file.response && file.response.success) || file.status === 'uploading'
        );
        this.setState({ fileList: files });

        this.props.onChange(imageUtil.getImagesUrl(fileList));
    };

    handleCancel = () =>
        this.setState({
            previewVisible: false,
        });

    handlePreview = file => {
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true,
        });
    };

    getDefauleFilelist = defaultValue => {
        if (!defaultValue) {
            return [];
        }

        if (Array.isArray(defaultValue)) {
            // 数组情况 ['http://img.souche.com/a.png', 'http://img.souche.com/b.png']
            return defaultValue.map((value, index) => {
                return {
                    /**
                     * uid 不可为0
                     * 否则在删除 uid 为0的图片时，会清空整个 fileList
                     */
                    uid: index + 1,
                    status: 'done',
                    url: value,
                    response: {
                        success: true,
                    },
                };
            });
        } else {
            // 字符串情况  'http://img.souche.com/a.png,http://img.souche.com/b.png'
            if (defaultValue.indexOf(',') !== -1) {
                let t = defaultValue.split(',');

                return t.map((value, index) => {
                    return {
                        uid: index + 1,
                        status: 'done',
                        url: value,
                        response: {
                            success: true,
                        },
                    };
                });
            } else {
                // 'http://img.souche.com/a.png'
                return [
                    {
                        uid: -1,
                        status: 'done',
                        url: defaultValue,
                        response: {
                            success: true,
                        },
                    },
                ];
            }
        }
    };

    updateDefaultValue = (defaultValue, url) => {
        if (!defaultValue) {
            return null;
        }

        if (Array.isArray(defaultValue)) {
            // 数组情况 ['http://img.souche.com/a.png', 'http://img.souche.com/b.png']
            return defaultValue.filter(defalutURL => {
                return defalutURL !== url;
            });
        } else {
            // 字符串情况  'http://img.souche.com/a.png,http://img.souche.com/b.png'
            if (defaultValue.indexOf(',') !== -1) {
                let t = defaultValue.split(',');
                return t
                    .filter(defalutURL => {
                        return defalutURL !== url;
                    })
                    .toString();
            } else {
                // 'http://img.souche.com/a.png'
                if (defaultValue === url) {
                    return null;
                } else {
                    return defaultValue;
                }
            }
        }
    };

    handleRemove = file => {
        this.props.onRemove({ file, updatedDefaultValues: this.updateDefaultValue(this.props.defaultValue, file.url) });
    };

    render() {
        const { previewVisible, previewImage, fileList } = this.state;

        const UploadButton = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">上传图片</div>
            </div>
        );

        let action = '';
        if (this.props.action.indexOf('http') === 0) {
            action = this.props.action;
        } else {
            action = window.SERVER_URL + this.props.action;
        }

        let num = this.props.num;
        let accept = this.props.accept || 'image/*';

        return (
            <div className="clearfix">
                <Upload
                    multiple={true}
                    listType="picture-card"
                    accept={accept}
                    {...this.props}
                    action={action}
                    onPreview={this.handlePreview}
                    fileList={fileList}
                    onChange={this.onChange}
                    onRemove={this.handleRemove}
                >
                    {fileList.length >= num ? null : UploadButton}
                </Upload>
                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </div>
        );
    }
}

export default RJImgUploader;
