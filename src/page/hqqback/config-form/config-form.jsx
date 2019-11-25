import React, {useState, useEffect} from "react"
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import axios from 'axios'
import {message} from 'antd'

import {Drawer ,Form, Input, Icon, Radio, Button} from 'antd'
// const {TextArea} = Input
// console.log(ClassicEditor.builtinPlugins.map( plugin => plugin.pluginName ))

export default function FormConfig() {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [formDesc, setFormDesc] = useState("")
  const [formArgument, setFormArgument] = useState(
    [
      {
        key: 'name',
        cnName: "姓名",
        type: 1,
        icon: "user"
      },
      {
        key: 'tell',
        cnName: "电话",
        type: 1,
        icon: 'phone'
      },
      {
        key: 'company',
        cnName: "公司/单位",
        type: 0,
        icon: 'global'
      },
      {
        key: 'office',
        cnName: '职位',
        type: 0,
        icon: 'solution'
      },
      {
        key: 'qq',
        cnName: 'QQ',
        type: 0,
        icon: 'qq'
      },
      {
        key: 'weixin',
        cnName: '微信',
        type: 0,
        icon: 'wechat'
      },
      {
        key: 'email',
        cnName: '邮箱',
        type: 0,
        icon: 'mail'
      },
      {
        key: 'other',
        cnName: '备注',
        type: 0,
        icon: 'smile'
      }
    ]
  )

  useEffect(() => {
    axios.post(window.config.host + "/api/hqqRouter/getFormConf")
    .then(resp => {
      if(resp.data.code == 200){
        message.success(resp.data.message)
        setDrawerVisible(resp.data.data.formDesc)
        setFormArgument(resp.data.data.formArgument)
      } else {
        message.error(resp.data.message)
      }
    }, err => {
      message.error(resp.code)
    })
  }, []);

  function showDrawer() {
    setDrawerVisible(true)
  }

  function closeDrawer() {
    setDrawerVisible(false)
  }

  function changeConfig(key, value) {
    const newConArr = JSON.parse(JSON.stringify(formArgument))
    newConArr[formArgument.findIndex(item => item.key === key)]["type"] = value
    setFormArgument(newConArr)
  }

  function onSubmit() {
    axios.post(window.config.host + "/api/hqqRouter/setFormConf", {
      formDesc, formArgument
    })
    .then(resp => {
      if(resp == 200){
        message.success(resp.data.message)
      } else {
        message.error(resp.data.message)
      }
    }, err => {
      message.error(resp.code)
    })
  }
  

  const itemConfig = formArgument.map(item => {
    return (
      <Form.Item label={item.cnName} key={item.key}>
        <Radio.Group
          value={item.type}
          buttonStyle="solid"
          onChange={(ev) => {changeConfig(item.key, ev.target.value)}}
        >
          <Radio.Button value={1}>必填</Radio.Button>
          <Radio.Button value={0}>可选</Radio.Button>
          <Radio.Button value={-1} title="不会展示在表单中">不可见</Radio.Button>
        </Radio.Group>
      </Form.Item>
    )
  })
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 4 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 20 },
    },
  }

  return (
    <div>
      <Button 
        type="primary" 
        shape="round"
        icon="setting"
        onClick={showDrawer}
      >
        Setting
      </Button>
      <Drawer
        title="表单配置"
        width={750}
        onClose={closeDrawer}
        visible={drawerVisible}
      >
        <Form {...formItemLayout}>
          <Form.Item label="描述">
            <CKEditor
              editor={ ClassicEditor }
              data={formDesc}
              config={{
                toolbar: [ 'heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote', '|', 'undo', 'redo' ],
                // removePlugins: [ 'EasyImage', 'ImageToolbar', 'Image' ]
                heading: {
                  options: [
                    { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
                    { model: 'heading1', view: 'h1', title: 'H1', class: 'ck-heading_heading1' },
                    { model: 'heading2', view: 'h2', title: 'H2', class: 'ck-heading_heading2' },
                    { model: 'heading3', view: 'h3', title: 'H3', class: 'ck-heading_heading3' }
                  ]
                }
              }}
              onInit={ editor => {
                console.log( 'Editor is ready to use!', editor );
                console.log(Array.from( editor.ui.componentFactory.names() ));
              } }
              onChange={ ( event, editor ) => {
                const data = editor.getData();  
                console.log( { event, editor, data } );
                setFormDesc(data)
              } }
              onBlur={ editor => {
                console.log( 'Blur.', editor );
              } }
              onFocus={ editor => {
                console.log( 'Focus.', editor );
              } }
            />
          </Form.Item>
          {itemConfig}
          <Form.Item
            style={{
              position: 'absolute',
              left: 0,
              bottom: 0,
              width: '100%',
              borderTop: '1px solid #e9e9e9',
              padding: '10px 16px',
              background: '#fff',
              textAlign: 'right',
              zIndex: 1,
            }}
          >
            <Button onClick={onSubmit} type="primary" htmlType="submit">
              Submit
            </Button>
            <Button onClick={closeDrawer} style={{ marginRight: 8 }}>
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  )
}