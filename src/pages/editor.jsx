import React, { Component } from 'react';
var antd =require('./../components/index.jsx');
import antComponents from './ant-coms.js';
import { Collapse,Modal,Form,Table,Button } from 'antd';
const Panel = Collapse.Panel;
import { Tag,Input,InputNumber,Alert,Select,Checkbox } from 'antd';
import _ from 'lodash'; // loadsh node 常用插件方法库<本块主要用道理深拷贝、uniq 去重方式>
import NativeListener from 'react-native-listener'; // react dom树侦听器，检测dom树动态
import ColorPicker from 'rc-color-picker';

import com_div from './coms/div';

import 'rc-color-picker/assets/index.css'
class Editor extends Component {
  constructor() {
    super();
    this.state = {
      dependComponents:[],
      draggingData:null,
      modal_visible:true,
      resultJSX:'',
      editCom:{},
      value4EditResult:{}, // 属性编辑器中4值编辑的临时存储
      comNowIndex:1, // 用来给每个组件唯一编号
      activeCom:{},
      editTarget:null,
      showAddList:false,
      hasBeginEdit:false,  // 模板显示隐藏
      isDragLayer:false,
      addListData:{

      },
      mouse_x:0,
      mouse_y:0,
      dragdiv_x:0,
      dragdiv_y:0,
      layer_x:0,
      layer_y:0,
      layer_show:false,
      layer_w:0,
      layer_h:0,
      layer_isTop:true,
      indent_space:'',
      data:[
        (function(){
          var div = _.cloneDeep(com_div); // 将初始化的 div 组件深拷贝份
          div.props.style.height = 200; // 设置初始高度
          return div; // 返回该 div (json数据)
        })()
      ]//以数组数据接收各个组件
    };
    var v = localStorage.getItem('cache_data');
    if(v){
      this.state.data = JSON.parse(v);
    }

    setTimeout(()=>{
      this.setState({
        hasBeginEdit:true
      })
    },3000)
  }

  _getComponent(types) { // 接收一个数组 ["Form", "Item"]这种方式
    if(types.length==1){ // 假如类型等于则是 antd 类型组件
      return antd[types[0]] 
    }else{
      var lastT = types.pop(); // 删除 types 数组最后一位
      var com = this._getComponent(types)[lastT]; // 此时做递归，页面中所有 tag 名称返回
      return com;
    }
  }

  findCanDropTarget(target){ // 样式添加
    if(target.className.indexOf('draggable')!=-1){
      return target;
    }else{
      return this.findCanDropTarget(target.parentNode); // 做递归
    }
  }
  renderJSON(json){ // 将 json 数组循环
    return (
      json.map((d,i)=>{
        d.id = this.state.comNowIndex++;
        if(d.hasDelete) return; // 如果具有 hasDelete 删除该 json 项

        var component; // 组件声明类型比如 div/p/span
        if(d.is_native){
          component = d.type;
        }else{
          component = this._getComponent(d.type.split('.')); // 此类型适用与 Form.Item 这种类型 type 处理
          this.state.dependComponents.push(d.type.split('.')[0]); // 最外层 tag (不触发 render 直接赋值)
        }

        var props = {}; // 假如该组件 json 具有 props/不具有时赋值为{}
        d.props = d.props||{};

        if(d.can_place){

          props.className = 'draggable'; // 给组件props添加className
          props.onDragOver = (e)=>{ // 给组件赋值 onDragOver 方法 （此处写重复）
            e.preventDefault();
          }
          props.onDrop = (e)=>{ // 组件 props 添加 onDrop 方法（选择）
            e.preventDefault();
            e.stopPropagation();
            this.findCanDropTarget(e.target).className = this.findCanDropTarget(e.target).className.replace('isdroping','')
            var com = this.state.draggingData ;
            d.childrens = d.childrens?d.childrens:[];
            d.childrens.push(_.cloneDeep(com)); // 做深拷贝
            this.forceUpdate();
          }
          props.onDragOver = (e)=>{ // 给组件赋值 onDragOver 方法 
            e.preventDefault();
            if(this.findCanDropTarget(e.target).className.indexOf('isdroping')==-1){
              this.findCanDropTarget(e.target).className += (' isdroping')
            }

          }
          props.onDragLeave = (e)=>{ // 组件离开（离开）
            e.preventDefault();
            this.findCanDropTarget(e.target).className = this.findCanDropTarget(e.target).className.replace('isdroping','')
          }
        }
        var outerProps = {};
        outerProps.onMouseOver = (e)=>{
          e.stopPropagation();
          e.preventDefault()
          if(!this.state.isDragLayer){
            this.showLayer(e.target,d);
          }
        }
        outerProps.onMouseLeave = (e)=>{
          e.stopPropagation();

          if(!this.state.isDragLayer){
            this.hideLayer();
          }
        }
        outerProps.onClick = (e)=>{
          e.stopPropagation();
          this.setState({
            editCom:d
          })
          this.forceUpdate();
        }
        var realProps = Object.assign({},d.props);
        for(var i in realProps){
          if(typeof(realProps[i]) == 'object' && realProps[i].type == 'relative'){
            realProps[i] = realProps[realProps[i].target]?realProps[i].true:realProps[i].false;
          }
        }
        if(d.sub_type == 'table_container') {
          realProps.columns.forEach((c)=>{
            if(c.childrens){
              c.render = ()=>{
                  return this.renderJSON(c.childrens)
              }
            }else if(c.type == '图文') {
                c.render = ()=>{
                  return <div>
                  <img src={'http://img.souche.com/20170406/jpg/9f9728decb009c757729c4fb712c0a6e.jpg'} style={{width:53,height:40,verticalAlign:'top'}}/>
                  <span style={{verticalAlign:'top',lineHeight:'40px',display:'inline-block',marginLeft:10}}>{c.title}</span>
                  </div>
                }
              }else if(c.type == '图片'){
                c.render = ()=>{
                  return <img src={'http://img.souche.com/20170406/jpg/9f9728decb009c757729c4fb712c0a6e.jpg'} style={{width:53,height:40,verticalAlign:'top'}}/>
                }
              }else if(c.type == '链接'){
                c.render = ()=>{
                  return <a>动作</a>
                }
              }
          })
        }
        if(d.wrap_inner){
          return <NativeListener {...outerProps}>
          {React.createElement(
            component,
            realProps,
            [<div {...props} style={{width:"100%",height:"100%",minHeight:20,minWidth:20}}>{
              d.props.content?[d.props.content]:(d.childrens?this.renderJSON(d.childrens):null)
            }</div>]
            )}
          </NativeListener>
        }else if(d.wrap){
          return <NativeListener {...outerProps}>
          <div {...props}  style={{width:"100%",height:"100%",minHeight:20,minWidth:20}}>
          {React.createElement(
            component,
            realProps,
            d.props.content?[d.props.content]:(d.childrens?this.renderJSON(d.childrens):null)
            )}
          </div>
          </NativeListener>
        }else{
          Object.assign(realProps,props);
          return <NativeListener {...outerProps}>
          {React.createElement(
            component,
            realProps,
            d.props.content?[d.props.content]:(d.childrens?this.renderJSON(d.childrens):null)
            )}
          </NativeListener>
        }
      })
      )
  }
  handleOk(){
    this.setState({
      modal_visible:false
    })
  }
  handleCancel(){
    this.setState({
      modal_visible:false
    })
  }

  showLayer(target,d) {
    var pos = this.getDOMPOS(target);
    this.setState({
      activeCom:d,
      layer_x:pos.x,
      layer_y:pos.y,
      layer_w:target.offsetWidth,
      layer_h:target.offsetHeight,
      layer_show:true,
      layer_isTop:true,
      dragdiv_x: target.offsetWidth+pos.x,
      dragdiv_y:target.offsetHeight+pos.y
    })

    document.getElementById("dragdiv").style.left = (target.offsetWidth+pos.x - 10) + 'px'
    document.getElementById("dragdiv").style.top = (target.offsetHeight+pos.y - 10) + 'px'

  }

  hideLayer(){
    this.setState({
      layer_show:false
    })
  }

  getDOMPOS(target) {
    　　　　var actualLeft = target.offsetLeft;
    　　　　var current = target.offsetParent;
    　　　　while (current !== null){
      　　　　　　actualLeft += current.offsetLeft;
      　　　　　　current = current.offsetParent;
    　　　　}
    　　　　var actualTop = target.offsetTop;
    　　　　var current = target.offsetParent;
    　　　　while (current !== null){
      　　　　　　actualTop += current.offsetTop;
      　　　　　　current = current.offsetParent;
    　　　　}
    return {
      x:actualLeft,
      y:actualTop
    }
  }

  renderEnumObject(editcom,key){
    var props = editcom.props[key];
    var config = editcom.config[key].enumobject;
    if(config.type == 'relative_props_object') {
      config = editcom.props[config.target];
    }
    return <div>
    <div style={{marginTop:10,marginBottom:10,fontWeight:'bold',fontSize:20}}>{editcom.config[key].text}</div>
    <Table
    pagination={false}
    bordered={true}
    size={"small"}
    columns={config.concat([{
      key:'xx',
      dataIndex:"xx",
      title:"操作",
      render:(text, record, index)=>{
        return <a onClick={()=>{
         props.splice(index,1)
         editcom.props[key] = _.cloneDeep(props);
         this.forceUpdate();
       }}>Delete</a>
     }
   }])}
    dataSource={props}
    />
    <Button icon="plus" style={{marginTop:10}} onClick={()=>{
      this.state.addListData = {}
      this.setState({
        showAddList:true
      })
    }}>添加一项</Button>
    {
      this.state.showAddList?<Form layout={"horizontal"} >
      {
        config.map((c)=>{

          return <Form.Item label={c.title} style={{marginBottom:5}}>
          {
            (()=>{
              if(c.type == 'String')
                return <Input placeholder={c.title} onInput={(v)=>{
                  this.state.addListData[c.dataIndex] = v.target.value+"";
                }}></Input>
              if(c.type == 'Number')
                return <InputNumber  onChange={(v)=>{
                  this.state.addListData[c.dataIndex] = v;
                }}></InputNumber>
              if(c.type == 'Boolean')
                return <Checkbox onChange={(v)=>{
                  this.state.addListData[c.dataIndex] = v;
                }}></Checkbox>
              else
                return <Input placeholder={c.title} onInput={(v)=>{
                  this.state.addListData[c.dataIndex] = v.target.value+"";
                }}></Input>
            })()
          }
              </Form.Item>
            })
      }
      <Form.Item label="" style={{marginBottom:5}}>
      <Button type="primary" onClick={()=>{
        this.setState({
          showAddList:false
        })

        if(editcom.sub_type == 'table_container'){
          this.state.addListData.childrens = [{
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
              backgroundColor:{
                text:"背景色",
              }
            }
          }]
        }

        props.push(this.state.addListData);

        editcom.props[key] = _.cloneDeep(props);
        this.state.addListData = {}
        this.forceUpdate();
      }}>提交</Button>
      </Form.Item>
      </Form>:null
    }
    </div>

  }

  findIdFromComs(id,coms,parent){
    var result = null;
    for(var i=0;i<coms.length;i++){
      var com = coms[i];
      if(com.id == id) {
        result =  {
          com:com,
          parent:parent
        }
        break;
      }else if(com.childrens){
        result = this.findIdFromComs(id,com.childrens,com);
      }
    }
    return result;
  }
  copyCom(com){
    var id = com.id;
    var {com,parent} = this.findIdFromComs(id,this.state.data);
    var cloneCom = _.cloneDeep(com);
    cloneCom.id = this.state.comNowIndex++;
    parent.childrens.push(cloneCom)
    this.forceUpdate();
  }

  render() {
    this.state.dependComponents = [];
    // localStorage 存储所有配置， 初始化 data == JSON.stringfy(div插件)
    localStorage.setItem('cache_data',JSON.stringify(this.state.data));
    return (
      <div 
        style={{ display: "flex"}} 
        className={'editor'} 
        onMouseMove={(e)=>{
          if(this.state.isDragLayer){
            e.stopPropagation();
            this.state.mouse_x = e.clientX;
            this.state.mouse_y = e.clientY;
            this.state.dragdiv_x = this.state.mouse_x
            this.state.dragdiv_y = this.state.mouse_y
            document.getElementById("dragdiv").style.left = this.state.mouse_x-5  +'px'
            document.getElementById("dragdiv").style.top = this.state.mouse_y-5  +'px'
            if(!this.state.activeCom.props.style) {
              this.state.activeCom.props.style = {}
            }
            this.state.layer_w =  this.state.activeCom.props.style.width = this.state.mouse_x + 5 - this.state.layer_x;
            this.state.layer_h = this.state.activeCom.props.style.height = this.state.mouse_y + 5 - this.state.layer_y;
            this.forceUpdate()
          }}
        } 
        onMouseUp={()=>{ this.state.isDragLayer = false;}}
      >
        <div 
          className="edit_layer" 
          style={{zIndex:(this.state.layer_isTop?1000:-10),display:(this.state.layer_show?"block":"none"),width:this.state.layer_w,height:this.state.layer_h,left:this.state.layer_x,top:this.state.layer_y}}
        >
          <div 
            color="#f50" 
            style={{position:'absolute',top:0,right:0,padding:"3px 10px",backgroundColor:"#999",color:"#fff"}}
          >{this.state.activeCom.title}</div>
        </div>
        <NativeListener 
          onMouseDown={(e)=>{
            e.stopPropagation();
            this.state.isDragLayer = true;
          }}
        >
          <div id="dragdiv" style={{width:10,height:10,background:"#aaa",position:"absolute",zIndex:100000}}></div>
        </NativeListener>
        <div style={{flex:1,position:'relative',marginRight:500}}>
          {
          (!this.state.hasBeginEdit) 
            ?
            <div 
              style={{position:'absolute',top:25,width:'100%',textAlign:'center',fontSize:20,color:"#aaa"}}
            >设计板，拖拽元素到此，点击元素可以编辑属性，红色虚线区域可以放置子组件</div>
            :null
          }
          { this.renderJSON(this.state.data) }
        </div>
        <div style={{width:500,background:'#eee',overflow:"auto",position:'fixed',right:0,top:0,height:window.innerHeight}}>
          <Collapse defaultActiveKey={['0','output']} onChange={()=>{}}>
            <Panel header={'属性编辑区 '+(this.state.editCom.title?`（${this.state.editCom.title}）`:'')} key={0}>
              <div style={{minHeight:"30px",background:"#fff"}}>
              {
                this.state.editCom.type?<Button onClick={()=>{
                  this.state.editCom.hasDelete = true;
                  this.forceUpdate();
                }} style={{marginRight:20}}>删除此元素</Button>:null
              }
              {
                this.state.editCom.type?<Button onClick={()=>{
                  this.copyCom(this.state.editCom);
                  this.forceUpdate();
                }} style={{marginRight:20}}>复制此元素</Button>:null
              }
              <Button onClick={()=>{
                localStorage.setItem('cache_data','');
                window.location.reload();
              }} style={{marginRight:20}}>清空并重新开始</Button>
              {
                (this.state.editCom&&this.state.editCom.config)
                  ?
                  Object.keys(this.state.editCom.config).map((key)=> {
                    if(key == 'style') {
                      var style = this.state.editCom.config.style;
                      return Object.keys(this.state.editCom.config.style).map((s) => {
                        if (style[s].type=='color') {
                          return (
                            <Form.Item label={this.state.editCom.config[key][s].text} style={{marginBottom:5}}>
                              <ColorPicker
                                color={this.state.editCom.props.style[s]||'#fff'}
                                onChange={(c)=>{
                                  this.state.editCom.props.style[s] = c.color;
                                  this.forceUpdate();
                                }}
                                placement="topRight" 
                              />
                            </Form.Item>
                          )
                        } else if(style[s].type=='4-value') {
                          var defaultValue = this.state.editCom.props.style[s] || "0";
                          if (defaultValue.toString().indexOf(' ')==-1) {
                            this.state.value4EditResult[s] = [defaultValue,defaultValue,defaultValue,defaultValue];
                          } else {
                            this.state.value4EditResult[s] = defaultValue.split(' ')
                          }
                          return (
                            <Form.Item 
                              label={this.state.editCom.config.style[s].text} 
                              style={{marginBottom:5}}
                            >
                              上：<Input 
                                  defaultValue={this.state.value4EditResult[s][0]} 
                                  onChange={(v)=>{
                                    this.state.value4EditResult[s][0] = v.target.value;
                                    this.state.editCom.props.style[s] = this.state.value4EditResult[s].join(" ")
                                    this.forceUpdate()
                                  }} 
                                  style={{width:50,marginRight:5}}></Input>
                              右：<Input 
                                  defaultValue={this.state.value4EditResult[s][1]} 
                                  onChange={(v)=>{
                                    this.state.value4EditResult[s][1] = v.target.value;
                                    this.state.editCom.props.style[s] = this.state.value4EditResult[s].join(" ")
                                    this.forceUpdate()
                                  }} 
                                  style={{width:50,marginRight:5}}></Input>
                              下：<Input 
                                  defaultValue={this.state.value4EditResult[s][2]} 
                                  onChange={(v)=>{
                                    this.state.value4EditResult[s][2] = v.target.value;
                                    this.state.editCom.props.style[s] = this.state.value4EditResult[s].join(" ")
                                    this.forceUpdate()
                                  }} 
                                  style={{width:50,marginRight:5}}></Input>
                              左：<Input defaultValue={this.state.value4EditResult[s][3]} onChange={(v)=>{
                                    this.state.value4EditResult[s][3] = v.target.value;
                                    this.state.editCom.props.style[s] = this.state.value4EditResult[s].join(" ")
                                    this.forceUpdate()
                                  }} style={{width:50}}></Input>
                            </Form.Item>
                          )
                        } else {
                          return (
                              <Form.Item 
                                label={this.state.editCom.config[key][s].text} 
                                style={{marginBottom:5}}
                              >
                                <Input 
                                  defaultValue={this.state.editCom.props[key][s]} 
                                  onChange={(v)=>{
                                    this.state.editCom.props[key][s] = v.target.value;
                                    this.forceUpdate()
                                  }}></Input>
                              </Form.Item>
                          )
                        }
                      })
                  } else if (this.state.editCom.config[key].enumobject){
                    return this.renderEnumObject(this.state.editCom,key);
                  } else {
                    return (
                      <Form.Item 
                        label={this.state.editCom.config[key].text} 
                        style={{marginBottom:5}}
                      >
                        {
                          (()=>{
                            if(this.state.editCom.config[key].enum){
                              return  (
                                <Select
                                  defaultValue={this.state.editCom.props[key]}
                                  style={{ width: 120 }}
                                  onChange={(v)=>{
                                    this.state.editCom.props[key] = (v=="true"?true:(v==="false"?false:v));
                                    this.forceUpdate();
                                  }}
                                >
                                  {
                                    this.state.editCom.config[key].enum.map((n)=>{
                                      return <Select.Option value={n}>{n}</Select.Option>
                                    })
                                  }
                                </Select>)
                            }else if(this.state.editCom.config[key].type=="Boolean"){
                              return  (
                                  <Checkbox
                                    checked={this.state.editCom.props[key]}
                                    onChange={(v)=>{
                                      this.state.editCom.props[key] = v.target.checked;
                                      this.forceUpdate();
                                    }}
                                  />
                              )
                            }else if(key=='content'){
                              return (
                                <Input defaultValue={this.state.editCom.props[key]} onChange={(v)=>{
                                  this.state.editCom.props[key] = v.target.value;
                                  this.forceUpdate()
                                }}></Input>
                              )
                            }else{
                              return (
                                <Input defaultValue={this.state.editCom.props[key]} onChange={(v)=>{
                                  this.state.editCom.props[key] = v.target.value;
                                  this.forceUpdate()
                                }}></Input>
                              )
                            }
                          })()
                        }
                      </Form.Item>
                    )
                  }
                }):(<Alert message="此组件无可编辑属性" type="warning" style={{marginTop:20}}></Alert>)
              }
            </div>
            </Panel>
            {
              antComponents.map((group,i)=>{
                return <Panel header={group.group_title+' '+group.coms.length} key={i+1}>
                {
                  group.coms.map((com,i2)=>{
                    return <Tag onDragStart={(ev)=>{
                      this.setState({
                        hasBeginEdit:true
                      })
                      this.state.draggingData = com;
                    }} draggable={true} key={i+''+i2}>{com.type} {com.title}</Tag>
                  })
                }
                </Panel>
              })
            }
            <Panel 
                header={'最终代码（自动更新）'} 
                key={'output'}
              >
                <Button 
                  style={{marginBottom:5}} 
                  onClick={()=>{
                    localStorage.setItem('preview_data',JSON.stringify(this.state.data));
                    window.open('#/preview')
                  }} 
                  type={'primary'}>生成预览页面</Button>
                <Input type="textarea" rows={10} value={this.renderJSONtoJSX()}></Input>
              </Panel>
          </Collapse>
        </div>
      </div>
  );
}

collectCom(data){

}

renderJSONtoJSX(){
  this.state.indent_space = ''

  return  `import React, { Component } from 'react';

  /*
  * 这里声明要引入的组件
  */
  import { ${_.uniq(this.state.dependComponents).join(', ')} } from '../components/index.jsx';

  /**
  * Index 一般是当前页面名称 index.html
  */
  class Index extends Component {
    constructor () {
      super();
    }
    render(){
      return ${this.renderElementtoJSX(this.state.data).replace(/\n    /,'')}
    }
  }
  export default Index;

  `
}

renderElementtoJSX(data){
  var result = '';
  this.state.indent_space += "    ";
  data.forEach((d)=>{
    if(d.hasDelete) return;
    console.log(d)
    console.log(d.props)
    result += `
    ${this.state.indent_space}<${d.type}${this.renderProps(d.props,d)}>${d.props.content?[d.props.content]:(d.childrens?this.renderElementtoJSX(d.childrens):'')}</${d.type}>
    `
  })
  this.state.indent_space = this.state.indent_space.replace('    ','');
  result +=  `${this.state.indent_space}`;
  return result;
}

renderProps(props,d){
  var result = '';
  var props = _.cloneDeep(props);
  for(var i in props){
    if(!(/^on[A-Z]/.test(i)||/draggable/.test(i)||/content/.test(i))){
      if(/^event_(.*?)/.test(i)){
        result += ` ${i.replace('event_','')}={()=>{ }}`
      }else if(typeof(props[i])=='object' && props[i].type == 'relative'){
        result += ` ${i}={${JSON.stringify(props[props[i].target]?props[i].true:props[i].false)}}`
      }else if(d.sub_type=="table_container" && i == 'columns'){
        var renderCache = {

        }
        props[i].forEach((p,pi)=>{
          if(p.childrens){
            var indentCache = this.state.indent_space;
            this.state.indent_space = '';

            renderCache['$$'+pi+'$$'] = `()=>{ return ${this.renderElementtoJSX(p.childrens).replace(/\n    /,'')}}`
            this.state.indent_space = indentCache
            p.render = '$$'+pi+'$$'
            delete p.childrens;
          }
        })
        var noindent = JSON.stringify(props[i])
        var indent = JSON.stringify(props[i],null,2);
        var r = noindent.length>100?indent:noindent;
        for(var m in renderCache){
          r = r.replace(`"${m}"`,renderCache[m])
        }
        result += ` ${i}={${r}}`
      }else{
        var noindent = JSON.stringify(props[i])
        var indent = JSON.stringify(props[i],null,2);
        result += ` ${i}={${noindent.length>100?indent:noindent}}`
      }

    }
  }
  return result;
}
}
export default Editor;
