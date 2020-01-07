export default {
  "type":"Tag",
  "title":"标签",

  props:{
    closable:false,
    "content":"标签",
  },
  config:{
    closable:{
      text:"是否可关闭",
      enum:["true","false"]
    },
    color:{
      text:"颜色",
      enum:[
        'red',
        'orange',
        'green',
        'blue'
      ]
    }
  }
}
