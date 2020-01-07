import React from 'react';
import { Menu, Icon } from 'antd';

const PropTypes = React.PropTypes;

class RJMenu extends React.Component {
    constructor() {
        super();
        /**
        this.state = {
          data:{
            mode:"horizontal",
            items:[{
              key:'1',
              icon:'mail',
              title:'第一级菜单',
              disabled:false,
              link:'#',
              subs:[
                {
                  key:'',
                  icon:'mail',
                  title:'第一级菜单',
                  type:"menu"
                },
                {
                  type:'group',
                  title:'分组1',
                  subs:[
                    {
                      key:'',
                      icon:'mail',
                      title:'第一级菜单'
                    },
                    {
                      key:'',
                      icon:'mail',
                      title:'第一级菜单'
                    }
                  ]
                },
                {
                  type:'group',
                  title:'分组2',
                  subs:[
                    {
                      key:'',
                      icon:'mail',
                      title:'第一级菜单'
                    },
                    {
                      key:'',
                      icon:'mail',
                      title:'第一级菜单'
                    }
                  ]
                }
              ]
            },{
              key:'2',
              icon:'plus',
              title:'第1级菜单',
              disabled:false,
              link:'#',
            },{
              key:'3',
              title:'第1级菜单',
              disabled:true,
              link:'#',
            }]
          }
        }
        */
    }

    render() {
        var data = this.props;
        return (
            <Menu mode={data.mode} {...this.props}>
                {data.items.map(v => {
                    return v.subs ? (
                        <Menu.SubMenu
                            title={
                                <span>
                                    {v.icon ? <Icon type={v.icon} /> : null}
                                    {v.title}
                                </span>
                            }
                        >
                            {v.subs.map(s => {
                                return s.type === 'group' ? (
                                    <Menu.ItemGroup title={s.title}>
                                        {s.subs.map(ss => {
                                            return (
                                                <Menu.Item key={ss.key}>
                                                    {ss.icon ? <Icon type={ss.icon} /> : null}
                                                    {ss.title}
                                                </Menu.Item>
                                            );
                                        })}
                                    </Menu.ItemGroup>
                                ) : (
                                    <Menu.Item key={s.key}>
                                        {s.icon ? <Icon type={s.icon} /> : null}
                                        {s.title}
                                    </Menu.Item>
                                );
                            })}
                        </Menu.SubMenu>
                    ) : (
                        <Menu.Item key={v.key} disabled={v.disabled}>
                            {v.icon ? <Icon type={v.icon} /> : null}
                            {v.title}
                        </Menu.Item>
                    );
                })}
            </Menu>
        );
    }
}

export default RJMenu;
