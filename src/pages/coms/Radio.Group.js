export default {
  "type":"Radio.Group",
  "title":"单选框",
  "props":{
    options:[
      { label: 'Apple', value: 'Apple',key:1 },
      { label: 'Pear', value: 'Pear',key:2 },
      { label: 'Orange', value: 'Orange', disabled: true,key:3 },
    ]
  },
  config:{
    options:{
      text:"项目配置",
      enumobject:[{
        key:1,
        dataIndex:"label",
        title:"显示文本",
        type:'String',
      },{
        key:2,
        dataIndex:"value",
        title:"真实值",
        type:'String',
      },{
        key:3,
        dataIndex:"disabled",
        title:"是否禁用",
        type:'Boolean',
        render: (v) => {
          return v?'是':'否';
        }
      }]
    }
  }
}
