import React from 'react';
import { Layout, Menu, Icon, Input, Form, Button, Modal, message, AutoComplete } from 'antd';
import './main.css';     
//import {Divider} from 'semantic-ui-react';
import axios from 'axios';
import Room from './Room';
import { withRouter} from 'react-router-dom';
import Channel from './Channel';
const { Sider} = Layout;
const {SubMenu} = Menu;
var randomize = require('randomatic');

class MainPage extends React.Component {
    
    state = {
        //main controller
        collapsed: false,
        channels:[],
        type:"channel",

        //channel
        selChannelId:"",

        //Final Message Conatiner
        currentRoom:{},
        enteredRoom:false,

        //CurrentTracker
        homeUser: this.props.homeUser||localStorage.getItem("aqs"),

        //create room
        rname:'',
        rcode:'',
        currentRid:'',
        openCreate:false,
        validateSatus:"",
        help:"", 

        //join Room
        data:[],
        searchQuery: "",
        jrcode:"",
        joinValidate: "",
        openJoin:false,
        joinCodeHelp:"",

        //leaveRoom
        levOpen:false,
        leaving:false,

        //delete Room
        delOpen:false,
    };

    componentWillMount() {
        if(this.state.homeUser===null && localStorage.getItem("aqs")===null)
        {
            this.props.history.push('/');
        }
    }
    componentDidMount()
    {/*
        window.addEventListener("beforeunload", function (e) {
            var confirmationMessage = "If You Leave";

            (e || window.event).returnValue = confirmationMessage; 

        });*/
    }

    //Leave Room
    leaveRoom=()=>{
        this.setState({ leaving:true }, () => {
            axios({
                method: "post",
                url: "https://markx5.herokuapp.com/leaveRoom"+this.state.currentRoom.rid,
                data: {
                    user:this.state.homeUser
                }
            }).then((res) => {
                if (res.data) {
                    this.setState({
                        leaving:false,
                        enteredRoom:false,
                        currentRoom:{},
                        type:"channel"
                    })
                }
            });
        });
    }

    //delete Room
    delRoom=()=>{
        this.setState({ leaving: true }, () => {
            axios({
                method: "post",
                url: "https://markx5.herokuapp.com/delRoom" + this.state.currentRoom.rid,
                data: {
                    user: this.state.homeUser
                }
            }).then((res) => {
                if (res.data) {
                    this.setState({
                        leaving: false,
                        enteredRoom: false,
                        currentRoom: {},
                        type: "channel"
                    })
                }
            });
        });
    }

    //Room Join
    searchRoom = (val) => {
        this.setState({joinCodeHelp:"",searchQuery: val }, async () => {
            axios.get('https://markx5.herokuapp.com/searchRoom?q=' + this.state.searchQuery)
                .then((response) => {
                    if(response.data===[])
                    {
                        this.setState({joinhelp:"there's no room live with this name!"})
                    }
                    else{
                        this.setState({ data: response.data });
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
        });
    }
    joinRoom=()=>{
        if(this.state.searchQuery==="" || this.state.jrcode==="") 
        {
            message.warning('Please enter all information!', 3);
            return;
        }
        this.setState({joining:true},()=>{
            axios({
                method: "post",
                url: "https://markx5.herokuapp.com/searchRid",
                data: {
                    rname: this.state.searchQuery
                }
            }).then((res)=>{
                if(res.data)
                {
                    axios({
                        method: "post",
                        url: "https://markx5.herokuapp.com/checkRcode",
                        data: {
                            rcode: this.state.jrcode,
                            rname: this.state.searchQuery,
                            homeUser:this.state.homeUser
                        }
                    }).then((res) => {
                        if (res.data.yes) {
                            let roomInfo = res.data.current;
                            if(roomInfo.homeUser===roomInfo.admin)
                            {
                                roomInfo.asAdmin=true;
                            }
                            else{
                                roomInfo.asAdmin=false;
                            }
                            this.setState({
                                joining: false,
                                enteredRoom: true,
                                joinCodeHelp: "",
                                joinValidate: "",
                                currentRoom: roomInfo,
                                openJoin:false,
                                
                            }, () => { this.setState({ type: "room"})})
                        }
                        else {
                            this.setState({ joinValidate: "error", joinCodeHelp: "incorrect room code!" })
                        }
                    });
                }
                else{
                    this.setState({joinCodeHelp:"no room with entered name exits!"})
                }

            });
        })
    }
    
    //Room Creation
    createRoom = () => {
        if (this.state.validateSatus === "success" && this.state.rname !== "" && this.state.rcode !== '')
        {

            this.setState({currentRid: randomize('A0', 10)},()=>{
            axios({
                method: "post",
                url: "https://markx5.herokuapp.com/createRoom",
                data: {
                    rid: this.state.currentRid,
                    admin: this.state.homeUser,
                    rname: this.state.rname,
                    rcode: this.state.rcode,
                }
            }).then((res) => {
                if (res) {
                    this.setState({
                     rname: "",
                     rcode: "",
                     validateSatus:"",
                     currentRoom:{
                         admin: res.data.admin,
                         roomName: res.data.roomName,
                         rcode: res.data.rcode,
                         time: res.data.time,
                         rid: res.data.roomId,
                         asAdmin: true,
                         homeUser:this.state.homeUser
                     },
                     enteredRoom:true,
                    type: "room",
                    openCreate:false
                });
                }else{
                    message.warning('Please enter all information!',3);
                }
            })
        });
        }
    }
    getRoomName=(value)=>{
        this.setState({validateSatus:"validating"});
        let val=value.target.value;
        this.setState({rname:val},async ()=>{
            axios.get('https://markx5.herokuapp.com/searchAvRname?q=' + this.state.rname)
                .then((response)=> {
                    if (!response.data) {
                        this.setState({ validateSatus: "success", help: ""});
                    } else {
                        this.setState({ validateSatus: "error", help: "room with this name already exits!" });
                    }
                })
                .catch(function (error) {
                    console.log(error);
            });
        });
    }

    //exit
    logout=()=>{
        this.setState({leaving:true});
        axios({
            method: "post",
            url: "https://markx5.herokuapp.com/exit",
            data: {
                user:this.state.homeUser
            }
        }).then((res)=>{
            if(res.data)
            {
                this.setState({homeUser:""});
                localStorage.clear();
                this.props.history.push('/');
            }
        }) 
    }

    render() {
        return (
                <Layout  style={{ height: "100vh" }}>
                <Sider theme="light" style={{ height: "100vh" }}trigger={null} collapsible collapsed={this.state.collapsed}>
                        <div className="pa2">
                            <div className="tc pt3 pb2 black ">
                            <Icon type="fire" className="myblue " style={{ fontSize: "15vh" }}theme="filled" /><span style={{ fontSize: "3vh" }} className="fw6">fireflow</span>
                            </div>
                            <div  className=" tc f3 pt3 fw6 pb2 " >
                            <span className="fw6 myblue" style={{ fontSize: "2.5vh" }}>@{this.state.homeUser}</span>
                            </div>
                            {this.state.enteredRoom?
                                <div>
                                    <div className="tc pl2 pr2  ">
                                    {this.state.currentRoom.asAdmin ? <Button shape="round" type="danger" loading={this.state.leaving}
                                        onClick={() => this.setState({delOpen:true})}
                                        className="w-100 h-100 f5 pb1" size="large ">
                                        <Icon type="logout" className=" v-mid pt1 dib  f4 fw6" />
                                        <span className="fw6 dib v-mid ">Delete Room</span>
                                    </Button> : <Button type="danger"  shape="round"loading={this.state.leaving}
                                        onClick={() => this.setState({levOpen:true})}
                                        className="w-100 h-100 f5 pb1" size="large ">
                                            <Icon type="logout" className=" v-mid pt1 dib  f4 fw6" />
                                            <span className="fw6 dib v-mid ">Leave Room</span>
                                        </Button>}
                                    </div>
                                    </div>
                                :
                                <div>
                                    <div className="tc pb2 pt2 pl2 pr2">
                                        <Button shape="round" type="primary" onClick={() => this.setState({ openCreate: true })} className="w-100 h-100 f5 pb1" size="large ">
                                            <Icon type="plus-circle" className=" v-mid pt1 f4 dib fw6" />
                                            <span className="fw6 dib v-mid ">Create Room</span>
                                        </Button>
                                    </div>
                                    <div className="tc pl2 pr2  ">
                                        <Button shape="round" type="default   " onClick={() => this.setState({ openJoin: true })} className="w-100 h-100 f5 pb1" size="large ">
                                            <Icon type="login" className=" v-mid pt1 dib  f4 fw6" />
                                            <span className="fw6 dib v-mid ">Join Room</span>
                                        </Button>
                                    </div>
                                </div>
                            }
                            <div className="pa2">
                                <Button type="danger" shape="round" loading={this.state.leaving}
                                onClick={this.logout}
                                className="w-100 h-100 f5 pb1" size="large ">
                                <Icon type="rollback" className=" v-mid pt1 dib  f4 fw6" />
                                <span className="fw6 dib v-mid ">Logout</span>
                            </Button>
                            </div>
                            <div style={{height:"54vh"}}/>
                            <div  className="tc">
                                Copyright @2019.
                            </div>
                        </div>
                    </Sider>     
                    {this.state.type === "room" ? <Room toMain={()=>this.setState({type:"channel",currentRoom:{}})} roomInfo={this.state.currentRoom}/>
                    : this.state.type === "channel" ? <Channel channelId={this.state.selChannelId} />:<h1>Home</h1>}
                    <Modal
                        title="Create Room"
                        centered
                        visible={this.state.openCreate}
                        footer={false}
                        onCancel={() => this.setState({ validateSatus: "",openCreate: false,rname:"",rcode:"" })}
                    >
                        <Form.Item help={this.state.help} hasFeedback validateStatus={this.state.validateSatus}>
                            <Input value={this.state.rname} placeholder="Room Name" onChange={this.getRoomName}/>
                        </Form.Item>
                        <Form.Item help=" will be used to enter room by others">
                            <Input value={this.state.rcode} placeholder="Room Code" id="warning2" 
                            onChange={(value)=>this.setState({rcode:value.target.value})}/>
                        </Form.Item>
                        <div className="pt3 tc">
                            <Button onClick={this.createRoom} type="primary" size="large">
                                Create
                            </Button>
                        </div>
                    </Modal>
                    <Modal
                        title="Join Room"
                        centered 
                        visible={this.state.openJoin}
                        footer={false}
                        onCancel={() => this.setState({joinCodeHelp:"", joinValidate: "", openJoin: false, searchQuery: "", jrcode: "" })}
                    >
                        <AutoComplete
                            value={this.state.searchQuery}
                            style={{ width: "100%"}}
                            dataSource={this.state.data}
                            placeholder="Enter Room Name To Join"
                            filterOption={(inputValue, option) =>
                                option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                            }
                            onChange={this.searchRoom}
                            onSelect={(val)=>this.setState({searchQuery:val})}
                        />
                        <Form.Item validateStatus={this.state.joinValidate} help={this.state.joinCodeHelp} className="pt3">
                            <Input value={this.state.jrcode} placeholder="Room Code" 
                                onChange={(value) => this.setState({ jrcode: value.target.value })} />
                        </Form.Item>
                        <div className=" tc">
                            <Button onClick={this.joinRoom} type="primary" size="large">
                                Join
                            </Button>
                        </div>
                </Modal>            
                    <Modal
                        title="Do you really want to leave this room?"
                        centered
                        visible={this.state.levOpen}
                        footer={false}
                        onCancel={() => this.setState({levOpen:false})}
                    >
                    <div className="f3 tc">
                        <Icon type="number" className="dib pr1" />
                        <span className="pl1 f3 pb3 fw6 dib black pr2">{this.state.currentRoom.roomName} </span>
                        <br></br>
                        <Button
                        
                            onClick={() => this.setState({ levOpen: false })}
                            type="primary" shape="round" className=" ma1  mr2 " block>No</Button> 
                        <br></br>
                        <Button type="danger" shape="round" loading={this.state.leaving}
                        onClick={()=>{
                            this.leaveRoom();
                            this.setState({ levOpen: false });
                        }} className="  ma1 mr2" block>Yes</Button>
                           
                    </div>
                    </Modal>
                    <Modal
                    title="Do you really want to Delete this room?"
                    centered
                    visible={this.state.delOpen}
                    footer={false}
                    onCancel={() => this.setState({ delOpen: false })}
                    >
                    <div className="f3 tc">
                        <Icon type="number" className="dib pr1" />
                        <span className="pl1 f3 pb3 fw6 dib black pr2">{this.state.currentRoom.roomName} </span>
                        <br></br>
                        <Button
                            onClick={() => this.setState({ delOpen: false })}
                            type="primary" shape="round" className=" ma1  mr2 " block>No</Button>
                        <br></br>
                        <Button type="danger" shape="round" loading={this.state.leaving}
                            onClick={() => {
                                this.delRoom();
                                this.setState({ delOpen: false });
                            }} className="  ma1 mr2" block>Yes</Button>
                        
                    </div>
                </Modal>
                </Layout>
        );
    }

}

export default withRouter(MainPage);
