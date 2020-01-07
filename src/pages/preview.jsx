import React, { Component } from 'react';
var antd =require('../components/index.jsx');
import Editor from './editor';

class Preview extends Editor {
  constructor() {
    super();
    this.state = {
        dependComponents:[],
        comNowIndex:0,
        indent_space:'',
        data:[{
          type:'Layout',
          title:'布局块',
          can_place:true,
          props:{
            style:{
              paddingBottom:'100px',
              background:"#fff"
            }
          },
        }]
    }
    var previewData = localStorage.getItem('preview_data')
    this.state.data = JSON.parse(previewData)
    setTimeout(()=>{
        this.forceUpdate();
    },100)
  }
  render() {
    return  (<div class="preview">
      <div style={{marginRight:400}}>
    {
      this.renderJSON(this.state.data)
    }
    </div>
    <div style={{width:400,background:'#eee',overflow:"auto",position:'fixed',right:0,top:0,height:window.innerHeight}}>
      <antd.Input type="textarea" style={{height:window.innerHeight}} value={this.renderJSONtoJSX()}></antd.Input>
    </div>
    </div>)
  }

}

export default Preview;
