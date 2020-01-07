
var _ = require('lodash');
import Common_Style from './common/style.config';

var com = {
  "type":"Table",
  "title":"表格",
  "sub_type":"table_container",
  "props":{
    "columns":[{
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      childrens:[{
        type:"div",
        title:"通用布局块",
        is_native:true,
        can_place:true,
        props:{
          style:{
            minHeight:20,
            padding:"0px",
          }
        },
        config:{
          padding:{
            text:"内间距",
            type:"4-value"
          },
          margin:{
            text:"外边距",
            type:"4-value"
          },
          ...Common_Style
        }
      }]
      
    }, {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
      childrens:[{
        type:"div",
        title:"通用布局块",
        is_native:true,
        can_place:true,
        props:{
          style:{
            minHeight:20,
            padding:"0px",
          }
        },
        config:{
          padding:{
            text:"内间距",
            type:"4-value"
          },
          margin:{
            text:"外边距",
            type:"4-value"
          },
          ...Common_Style
        }
      }]
    }, {
      title: '住址',
      dataIndex: 'address',
      key: 'address',
      childrens:[{
        type:"div",
        title:"通用布局块",
        is_native:true,
        can_place:true,
        props:{
          style:{
            minHeight:20,
            padding:"0px",
          }
        },
        config:{
          padding:{
            text:"内间距",
            type:"4-value"
          },
          margin:{
            text:"外边距",
            type:"4-value"
          },
          ...Common_Style
        }
      }]
    }],
    "dataSource":[{
      key: '1',
      name: '胡彦斌',
      age: 32,
      address: '西湖区湖底公园1号'
    }],
    bordered:true,
    size:"small",
    style:{
      margin:"0px",
      padding:"0px"
    },
    showRowSelection:false,
    pagination:false,
    rowSelection:{
      type:'relative',
      target:'showRowSelection',
      true:{
          selectedRowKeys:[],
          onChange:(selectedRowKeys)=>{
              
          }
      },
      false:null
    }
  },
  config:{
    columns:{
      text:"列管理",
      enumobject:[
        {
          title: '列文本',
          dataIndex: 'title',
          type:"String"
        },
        {
          title: '列key',
          dataIndex: 'dataIndex',
          type:"String"
        }
      ]
    },

    showRowSelection:{
      text:"是否显示选择框",
      type:'Boolean'
    },
    pagination:{
      text:"是否显示分页",
      type:'Boolean'
    },
    style:{
      padding:{
        text:"内间距",
        type:"4-value"
      },
      margin:{
        text:"外边距",
        type:"4-value"
      },
      ...Common_Style
    },
  }

};
export default com;
