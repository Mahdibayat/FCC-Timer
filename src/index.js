import React from "react";
import ReactDOM from 'react-dom';
import './index.scss'

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sessionTime: 1500,
            breakTime: 300,
            mainTime: 1500,
            counter: "session",
            status: "paused",
            buttonLabel: "start"
        };
        this.secondsToMMSS = this.secondsToMMSS.bind(this);
        this.secondsToMinutes = this.secondsToMinutes.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.alarmSound = this.alarmSound.bind(this);
        this.countDown = this.countDown.bind(this);

    }

    secondsToMMSS(timeInSeconds) {

        let minutes = Math.floor(timeInSeconds / 60);
        let seconds = timeInSeconds - minutes * 60;
        if (minutes < 10) {
            minutes = "0" + minutes;
        }
        if (seconds < 10) {
            seconds = "0" + seconds;
        }
        return minutes + ":" + seconds;
    }

    secondsToMinutes(timeInSeconds) {
        return timeInSeconds / 60;
    }

    handleClick(event) {
        switch (event.target.id) {
            case "session-increment":
                if (this.state.sessionTime < 3600) {
                    this.setState({
                        sessionTime: this.state.sessionTime + 60,
                        mainTime: this.state.sessionTime + 60,
                        counter: "session",
                        status: "paused",
                        buttonLabel: "start"
                    });
                }
                ;
                clearInterval(this.timeLeft);
                break;
            case "session-decrement":
                if (this.state.sessionTime > 60) {
                    this.setState({
                        sessionTime: this.state.sessionTime - 60,
                        mainTime: this.state.sessionTime - 60,
                        counter: "session",
                        status: "paused",
                        buttonLabel: "start"
                    });
                }
                clearInterval(this.timeLeft);
                break;
            case "break-increment":
                if (this.state.breakTime < 3600) {
                    this.setState({
                        breakTime: this.state.breakTime + 60,
                        mainTime: this.state.sessionTime,
                        counter: "session",
                        status: "paused",
                        buttonLabel: "start"
                    });
                }
                clearInterval(this.timeLeft);
                break;
            case "break-decrement":
                if (this.state.breakTime > 60) {
                    this.setState({
                        breakTime: this.state.breakTime - 60,
                        mainTime: this.state.sessionTime,
                        counter: "session",
                        status: "paused",
                        buttonLabel: "start"
                    });
                }
                clearInterval(this.timeLeft);
                break;
            case "start_stop":
                if (this.state.status == "paused") {
                    this.setState({
                        status: "counting",
                        buttonLabel: "pause"
                    });
                    this.countDown();
                } else {
                    clearInterval(this.timeLeft);
                    this.setState({
                        status: "paused",
                        buttonLabel: "resume"
                    });
                }
                break;
            case "reset":
                this.setState({
                    sessionTime: 1500,
                    breakTime: 300,
                    mainTime: 1500,
                    counter: "session",
                    status: "paused",
                    buttonLabel: "start"
                });
                clearInterval(this.timeLeft);
                this.alarmSound("reset");
                break;
        }
    }

    alarmSound(action) {
        let audio = document.getElementById("beep");
        if (action == "play") {
            audio.play();
        } else if (action == "reset") {
            audio.pause();
            // Reset the audio clip to the start:
            audio.currentTime = 0;
        }
    }

    countDown() {
        this.timeLeft = setInterval(() => {
            if (this.state.mainTime > 0) {
                this.setState({
                    mainTime: this.state.mainTime - 1,
                });
            } else {
                clearInterval(this.timeLeft);
                this.alarmSound("play");
                if (this.state.counter == "session") {
                    this.setState({
                        counter: "break",
                        mainTime: this.state.breakTime,
                    });
                    this.countDown();
                } else {
                    this.setState({
                        counter: "session",
                        mainTime: this.state.sessionTime,
                    });
                    this.countDown();
                }
            }
        }, 1000);
    }


    render() {
        const timeLeft = 0;
        return (
            <div>
                <audio id="beep" src="https://freesound.org/data/previews/250/250629_4486188-lq.mp3"/>
                <div>
                    <h1>Pomodoro Clock</h1>
                </div>
                <div id="timer-elements">
                    <div className="settings">
                        <div id="break-settings" className='pad'>
                            <div className="timer-label" id="break-label">break</div>
                            <button id="break-decrement" onClick={this.handleClick}>-</button>
                            <span className="time-amount"
                                  id="break-length">{this.secondsToMinutes(this.state.breakTime)}</span>
                            <button id="break-increment" onClick={this.handleClick}>+</button>
                        </div>

                        <div id="session-settings" className='pad'>
                            <div className="timer-label" id="session-label">session</div>
                            <button id="session-decrement" onClick={this.handleClick}>-</button>
                            <span className="time-amount"
                                  id="session-length">{this.secondsToMinutes(this.state.sessionTime)}</span>
                            <button id="session-increment" onClick={this.handleClick}>+</button>
                        </div>
                    </div>

                    <div id="timer">
                        <div id="timer-details">
                            <div id="timer-label">{this.state.counter}</div>
                        </div>
                        <div id="time-left">{this.secondsToMMSS(this.state.mainTime)}</div>
                    </div>
                    <div id="timer-controls">
                        <button id="start_stop" onClick={this.handleClick}>{this.state.buttonLabel}</button>
                        <button id="reset" onClick={this.handleClick}>reset</button>
                    </div>
                </div>
            </div>
        );
    }
}

ReactDOM.render(<App/>, document.getElementById("root"));