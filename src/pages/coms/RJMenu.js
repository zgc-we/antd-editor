export default {
  "type":"RJMenu",
  "title":"导航菜单",
  props:{
    mode:"horizontal",
    theme:"light",
    items:[{
      key:'1',
      icon:'mail',
      title:'第一级菜单',
      disabled:false,
      link:'#',

    },{
      key:'2',
      icon:'plus',
      title:'第1级菜单',
      disabled:false,
      link:'#',
    },{
      key:'3',
      title:'第3级菜单',
      disabled:true,
      link:'#',
    }]
  },
  config:{
    mode:{
      text:'模式',
      enum:[
        'inline',
        'horizontal',
        'vertical'
      ]
    },
    theme:{
      text:'主题色',
      enum:[
        'light',
        'dark'
      ]
    },
    items:{
      text:"数据源",
      enumobject:[
        {
          title: '菜单文本',
          dataIndex: 'title',
          type:"String"
        },
        {
          title: '链接',
          dataIndex: 'link',
          type:"String"
        },
        {
          title: '图标',
          dataIndex: 'icon',
          type:"String"
        },
        {
          title: '是否禁用',
          dataIndex: 'disabled',
          type:"Boolean"
        }
      ]
    }

  }
}
