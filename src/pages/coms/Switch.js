export default {
  type:'Switch',
  title:'开关切换',
  props:{
    size:'default'
  },
  config:{
    size:{
      text:'大小',
      enum:[
        'default',
        'small'
      ]
    }
  }
}
