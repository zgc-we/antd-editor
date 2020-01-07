export default {
  "type":"RJSelect",
  "title":"下拉列表",
  props:{
    selectData:[{
      key:'1',
      value:'第一个',
    },{
      key:'2',
      value:'第二个'
    }],
    mode: "",
    placeholder:'请选择',
    style:{}
  },
  config:{
    style:{
      width:{
        text:"宽度"
      }
    },
    value:{
      text:"默认值"
    },
    mode:{
      text:"类型",
      enum:[
        '','multiple', 'tags', 'combobox'
      ]
    },
    selectData:{
      text:"数据源",
      enumobject:[
        {
          title: '文本',
          dataIndex: 'value',
          type:"String"
        },
        {
          title: '真实值',
          dataIndex: 'key',
          type:"String"
        }
      ]
    }

  }
}
