import React from 'react';
import './main.css';
import {withRouter,Router} from 'react-router-dom';
import axios from 'axios';
import { Form, Icon, Input, Button, Typography, Layout, message} from 'antd';
import {Row,Col} from 'react-flexbox-grid';
import aa from '../aa.png';
const {Content} =Layout;
const { Title,Text } = Typography;

class Home extends React.Component
{
    constructor(props){
        
        super(props);
        this.state = {
            loading:false,
            Validate:"",
            help:"",
            homeUser:""
        }
    }
    componentDidMount() {
        if(localStorage.getItem("aqs")!==null)
        {
            this.props.history.push('/main')
        }
    }
    enter=()=>{
        if(this.state.homeUser==="")
        {
            message.warning('Please enter your Name!', 3);
            return;
        }
        else if(this.state.Validate==="error")
        {
            message.warning(' Specified username already taken!', 3);
            return;
        }
        this.setState({loading:true});
        var time = new Date();
        var creationtime = time.toLocaleString("en-US", {
            hour: "numeric",
            minute: "numeric",
            hour12: true
        });
        axios({
            method: "post",
            url: "https://markx5.herokuapp.com/setUniUser",
            data: {
                user:this.state.homeUser,
                time:creationtime
            }
        }).then((res) => {
            if (res.data) {
                localStorage.setItem("aqs",this.state.homeUser);
                this.setState({
                    loading:false
                },() => {
                    this.props.history.push('/main');
                })
            }
            else{
                this.setState({
                    loading: false
                }, () => {
                    message.info('Too much Traffic.Try Again!',3);
                })
            }
        });

    }

    serachRoom=(val)=>{
        this.setState({ Validate: "validating" });
        let valu = val.target.value;
        this.setState({ homeUser: valu }, async () => {
            this.props.getHomeUser(valu);
            axios.get('https://markx5.herokuapp.com/searchUser?q=' + this.state.homeUser)
                .then((response) => {
                    if (!response.data) {
                        this.setState({ Validate: "success", help: "" });
                    } else {
                        this.setState({ Validate: "error", help: "name already taken!" });
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
        });
    }
    
    render()
    {
        return(
            <Layout className="" style={{ height: "100vh" }}>
                <Content style={{backgroundImage:"url("+aa+")",backgroundSize:"cover"}}>
                    <span className="f3 pt4 shadow-1 pa3 br-pill pl3 gray fw6" style={{fontSize:"3vh"}}>Chat on go!</span>
                    <Row center="xs"  className="cen">
                        <Col xs={4} >
                        </Col>
                        <Col xs={2} className="tr">
                                        <div className="dib v-mid tc pt5 pr4" >
                                            <Icon type="fire" style={{ fontSize: "18vh" }} className="logo" theme="filled" />
                                            <Title level={2} style={{ fontSize: "3vh" }} className="pa2 white" type="secondary">
                                                <span className="gray">fireflow</span>
                                            </Title>
                                        </div>
                                    </Col>
                        <Col xs={2} className="tl pl4 pt4" style={{ width: "50vw" }} >
                            <Title level={2}>Enter Display Name for Chat.</Title>
                            <Text className=" f6 gray">Your Info Will be Erased as soon as you logout.</Text>
                            <Form className="dib tl  v-mid login-form " style={{ width: "20vw",fontSize:"3vh" }}  >
                                <Form.Item hasFeedback help={this.state.help} validateStatus={this.state.Validate}>
                                    <Input
                                        spellCheck={false}
                                        prefix={<Icon type="fire" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                        placeholder="Set Username"
                                        onChange={this.serachRoom}
                                    />
                                </Form.Item>
                                <Form.Item>
                                    <Button loading={this.state.loading} type="primary"
                                        onClick={this.enter} className="w-30">
                                        Enter
                                    </Button>
                                </Form.Item>
                            </Form>
                                    </Col>
                        <Col xs={4}/>
                    </Row>
                    <span className="f5 fr pr3 " style={{paddingTop:"48.6%"}}>Copyright @2019.</span>
                </Content>
            </Layout>
        );
    }
}

export default withRouter(Home);