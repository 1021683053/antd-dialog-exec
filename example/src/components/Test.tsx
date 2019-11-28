import React from 'react'
import { Typography, Button, Divider } from 'antd';
import { WithDialogProps } from 'antd-dialog-exec';


const { Title, Paragraph, Text } = Typography;


export default class extends React.Component<WithDialogProps & any>{

  // 默认配置
  static defaultWrappedProps = {
    width: 600,
    title: '这是一个弹出层',
  }

  public display = ()=>{
    console.log('------------------------')
  }

  public componentDidMount (){
    const { dialog } = this.props
    const wrappedProps = {
      onCancel: ()=>{
        console.log( '+++++++++++' )
        dialog.destroy()
      },
      onOk: ()=>{
        dialog.updateWrapped({ confirmLoading: true })
        setTimeout(() => {
          dialog.updateWrapped({ confirmLoading: false })
          dialog.destroy()
        }, 3000);

      }
    }
    dialog.updateWrapped(wrappedProps)
  }

  render(){
    console.log(this.props)
    return (
      <Typography>
        <Title>Introduction {this.props.sex}</Title>

        <Paragraph>
          In the process of internal desktop applications development, many different design specs and
          implementations would be involved, which might cause designers and developers difficulties and
          duplication and reduce the efficiency of development.
        </Paragraph>
        <Paragraph>
          After massive project practice and summaries, Ant Design, a design language for background
          applications, is refined by Ant UED Team, which aims to
          <Text strong>
            uniform the user interface specs for internal background projects, lower the unnecessary
            cost of design differences and implementation and liberate the resources of design and
            front-end development
          </Text>
          .
        </Paragraph>
        <Title level={2}>Guidelines and Resources</Title>
        <Paragraph>
          We supply a series of design principles, practical patterns and high quality design resources
          (<Text code>Sketch</Text> and <Text code>Axure</Text>), to help people create their product
          prototypes beautifully and efficiently.
        </Paragraph>
        <Button type='primary' onClick={()=> this.props.dialog.destroy()}>Close</Button>
        <Divider />
        <Button type='primary' onClick={()=> this.props.dialog.update({ wrappedProps: { width: 500 } })}>Size`500`</Button>
        <Divider />
        <Button type='primary' onClick={()=> this.props.dialog.update({ wrappedProps: { title: '动态切换标题' } })}>Title`动态切换标题`</Button>
        <Button type='primary' onClick={()=> this.props.dialog.update({ contentProps: { sex: 'Man' } })}>更新</Button>

        <Button type='primary' onClick={()=> this.props.dialog.exec({ name: 'Simple', wrappedProps: { width: 900, title: '6666' } })}>打开另一个窗口</Button>
      </Typography>
    )
  }
}
