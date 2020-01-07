export default {
    "type": "Button",
    "title": "按钮",
    "props": {
        type: 'primary',
        content: '按钮一只',
        style: {
            margin: "0px 10px 0px 0px"
        }
    },
    config: {
        type: {
            text: "主题",
            enum: [
                'primary',
                'default',
                'dashed',
                'danger'
            ]
        },
        icon: {
            text: "图标",
        },
        content: {
            text: '文案',
        },
        style: {
            width: {
                text: "宽度",
            },
            margin: {
                text: "外边距",
                type: "4-value"
            }
        }
    },
}
