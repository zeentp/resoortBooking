import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import { Menu, Modal, DatePicker, message } from 'antd';
import { Button } from 'semantic-ui-react';
import { Link, useHistory, Route, withRouter } from 'react-router-dom';
import moment from 'moment';
import axios from 'axios';
import { connect } from 'react-redux';
import '../css/HomePage.css';
import '../css/navw3.css';
import Room1 from './Room1';
import Room2 from './Room2';
import Room3 from './Room3';
import Room4 from './Room4';
import Room5 from './Room5';
import Room6 from './Room6';
import Map from '../Map/Map';
import room1 from '../img/room1/room.png';
import room2 from '../img/room2/room.png';
import room3 from '../img/room3/room.png';
import room4 from '../img/room4/room.png';
import room5 from '../img/room5/room.jpg';
import room6 from '../img/room6/room.jpg';
import logo from '../img/resort/logo.png';
import Contact from './Contact';
import Confirm from './StatusVerification';
const { SubMenu } = Menu;
const { RangePicker } = DatePicker;
const dateFormat = 'DD/MM/YYYY';
var dateList = [];


function range(start, end) {
    const result = [];
    for (let i = start; i < end; i++) {
        result.push(i);
    }
    return result;
}

function disabledDate(current) {
    // Can not select days before today and today
    if (!current) {
        // allow empty select
        return false;
      } const date = moment();
      date.hour(0);
      date.minute(0);
      date.second(0)
    if (current.valueOf() < date.valueOf()){
        return true ;
    }
    if (current >moment().add(3, "month")){
        return true;
    }
      
  }

function disabledRangeTime(_, type) {
    if (type === 'start') {
        return {
            disabledHours: () => range(0, 60).splice(4, 20),
            disabledMinutes: () => range(30, 60),
            disabledSeconds: () => [55, 56],
        };
    }
    return {
        disabledHours: () => range(0, 60).splice(20, 4),
        disabledMinutes: () => range(0, 31),
        disabledSeconds: () => [55, 56],
    };
}

class HomePage extends React.Component {

    constructor() {
        super();
        this.state = {
            typeA: 10,
            typeB: 8,
            typeC: 6,
            typeD: 1,
            typeE: 5,
            typeF: 2
        };
    }

    handleDropdownClick = () => {
        var dropdown = document.getElementsByClassName("dropdown-btn");
        var i;
        for (i = 0; i < dropdown.length; i++) {
            dropdown[i].addEventListener("click", function () {
                this.classList.toggle("active");
                var dropdownContent = this.nextElementSibling;
                if (dropdownContent.style.display === "block") {
                    dropdownContent.style.display = "none";
                } else {
                    dropdownContent.style.display = "block";
                }
            });
        }
    }
    state = { visible: false };

    showModal = () => {
        this.setState({
            visible: true,
        });
    };

    handleOk = e => {
        console.log(e);
        this.setState({
            visible: false,
        });
    };

    handleCancel = e => {
        console.log(e);
        this.setState({
            visible: false,
        });
    };

    onChangeDate = (date, dateString) => {
        while (dateList.length) {
            dateList.pop();
        }
        this.props.dispatch({
            type: 'CLEAR_LIST'
        })
        var date1 = date[0]._d;
        var date2 = date[1]._d;
        var dd = date1.getDate();
        var mm = date1.getMonth() + 1;
        var yy = date1.getFullYear();
        var myDateString = dd + "-" + mm + "-" + yy;
        dateList.push(myDateString);
        var d = myDateString;
        this.props.dispatch({
            type: 'ADD_DATE',
            d
        })
        this.calDiff(date1, date2)
    }

    calDiff = (date1, date2) => {
        var diff;
        var count = 0;
        if (date1 && date2) {
            diff = Math.floor((date2.getTime() - date1.getTime()) / 86400000);
            while (date1.getTime() < date2.getTime()) {
                date1.setDate(date1.getDate() + 1);
                var dd = date1.getDate();
                var mm = date1.getMonth() + 1;
                var yy = date1.getFullYear();
                var myDateString = dd + "-" + mm + "-" + yy;
                dateList.push(myDateString);
                var d = myDateString;
                this.props.dispatch({
                    type: 'ADD_DATE',
                    d
                })
                count++;
            }
            date1.setDate(date1.getDate() - count)
        }
    }

    onSubmit = (e) => {
        e.preventDefault();
        if (dateList.length == 1) {
            message.error('กรุณาเลือกวันที่ให้ถูกต้อง')
        }
        else if (dateList.length == 0) {
            message.error('กรุณาเลือกช่วงวันที่ต้องการเข้าพัก');
        }
        else {
            this.props.history.push('/ShowAvailableRoom')
        }
    }

    // ลบข้อมูลออกจาก temp
    componentDidMount() {
        axios.delete('/deleteTempData')
    }

    render() {
        return (
            <div>
                <div class="sidenav">
                    <div>
                        <img src={logo} class="logo" />
                    </div>
                    <a href="#homePage" onclick="w3_close()" class="w3-bar-item w3-button w3-hover-white" id="navLabel">หน้าหลัก</a>
                    <button class="dropdown-btn" id="navLabel" onClick={this.handleDropdownClick} >รายละเอียดห้อง<i onClick={this.handleDropdownClick} class="fa fa-caret-down"></i></button>
                    <div class="dropdown-container">
                        <a href="#BigSingleHouse" onclick="w3_close()" class="w3-bar-item w3-button w3-hover-white" id="navLabel">บ้านเดี่ยวหลังใหญ่</a>
                        <a href="#SmallSingleHouse" onclick="w3_close()" class="w3-bar-item w3-button w3-hover-white" id="navLabel">บ้านแฝดหลังเล็ก</a>
                        <a href="#TwinHouse" onclick="w3_close()" class="w3-bar-item w3-button w3-hover-white" id="navLabel">บ้านแฝด</a>
                        <a href="#RiverSideHouse" onclick="w3_close()" class="w3-bar-item w3-button w3-hover-white" id="navLabel">บ้านริมน้ำ</a>
                        <a href="#SmallThaiHouse" onclick="w3_close()" class="w3-bar-item w3-button w3-hover-white" id="navLabel">เรือนไทยหลังเล็ก</a>
                        <a href="#BigThaiHouse" onclick="w3_close()" class="w3-bar-item w3-button w3-hover-white" id="navLabel">เรือนไทยหลังใหญ่</a>
                    </div>
                    <a href="#Map" onclick="w3_close()" class="w3-bar-item w3-button w3-hover-white" id="navLabel">แผนที่และการเดินทาง</a>
                    <a href="#Contact" onclick="w3_close()" class="w3-bar-item w3-button w3-hover-white" id="navLabel">ติดต่อเรา</a>

                    <a onClick={this.showModal} class="w3-bar-item w3-button w3-hover-white" id="navLabel">ตรวจสอบสถานะการจอง</a>
                    <Modal
                        style={{fontFamily: "Kanit, sans-serif"}}
                        width={800}
                        title="ตรวจสอบสถานะการจอง"
                        visible={this.state.visible}
                        footer={null}
                        maskClosable={false}
                        onOk={this.handleOk}
                        onCancel={this.handleCancel}
                    >
                        <Confirm />
                    </Modal>
                    <Link to='/ComfirmInfo' id="navLabel" class="w3-bar-item w3-button w3-hover-white" target="_blank" >อัพโหลดสลิปค่ามัดจำ</Link>

                </div>

                <div class="w3-container" id="container">
                    <h1><b id="homePage" class="firstCha">F</b><b class="w3-jumbo" style={{ fontFamily: "Poppins, sans-serif" }}>aang<b class="firstCha">F</b>ang Resort</b></h1>
                    <div style={{ marginTop: "4%" }}>
                        <b style={{ fontFamily: "Kanit, sans-serif", fontSize: "25px", marginRight: "3%", color: "#616161" }} >ค้นหาห้องพัก</b>
                        <RangePicker disabledDate={disabledDate}
                            disabledTime={disabledRangeTime} onChange={this.onChangeDate} format={dateFormat} />
                        {/* <RangePicker onChange={this.onChangeDate} format={dateFormat} /> */}
                        {/* <Link to="/ShowAvailableRoom"><Button style={{ marginLeft: "2%", fontFamily: "Kanit, sans-serif" }} >ค้นหาห้องพัก</Button></Link> */}
                        <Button style={{ marginLeft: "2%", fontFamily: "Kanit, sans-serif" }} onClick={this.onSubmit}>ค้นหาห้องพัก</Button>
                    </div>
                    <h1><b class="smallCha">Room Types</b></h1>
                    <hr class="w3-round"></hr>

                    <div class="w3-row-padding">
                        <div class="w3-half">
                            <div class="container">
                                <img src={room1} onclick="onClick(this)" alt="Concrete meets bricks" class="picture" />
                                <a class="roomLabel">บ้านเดี่ยวหลังใหญ่ 600 บาท/คืน</a>
                            </div>
                            <div class="container">
                                <img src={room3} onclick="onClick(this)" alt="Light, white and tight scandinavian design" class="picture" />
                                <a class="roomLabel">บ้านแฝดหลังเล็ก 400 บาท/คืน</a>
                            </div>
                            <div class="container">
                                <img src={room5} onclick="onClick(this)" alt="White walls with designer chairs" class="picture" />
                                <a class="roomLabel">เรือนไทยหลังเล็ก 500 บาท/คืน</a>
                            </div>
                        </div>

                        <div class="w3-half">
                            <div class="container">
                                <img src={room2} onclick="onClick(this)" alt="Windows for the atrium" class="picture" />
                                <a class="roomLabel1">บ้านแฝด 500 บาท/คืน</a>
                            </div>
                            <div class="container">
                                <img src={room4} onclick="onClick(this)" alt="Bedroom and office in one space" class="picture" />
                                <a class="roomLabel1">บ้านริมน้ำ 700 บาท/คืน</a>
                            </div>
                            <div class="container">
                                <img src={room6} onclick="onClick(this)" alt="Scandinavian design" class="picture" />
                                <a class="roomLabel">เรือนไทยหลังใหญ่ 800 บาท/คืน</a>
                            </div>
                        </div>
                    </div>
                    <hr />
                    <div id="BigSingleHouse">
                        <Room1 />
                    </div>
                    <hr />
                    <div id="SmallSingleHouse">
                        <Room2 />
                    </div>
                    <hr />
                    <div id="TwinHouse">
                        <Room3 />
                    </div>
                    <hr />
                    <div id="RiverSideHouse">
                        <Room4 />
                    </div>
                    <hr />
                    <div id="SmallThaiHouse">
                        <Room5 />
                    </div>
                    <hr />
                    <div id="BigThaiHouse">
                        <Room6 />
                    </div>
                    <hr />
                    <div id="Map">
                        <Map />
                    </div>
                </div >
                <div style={{ marginLeft: "20%" }} id="Contact">
                    <Contact />
                </div>
            </div>
        );
    }

}

export default connect()(HomePage);