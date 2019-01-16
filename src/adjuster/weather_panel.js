import React, {Component} from 'react';
import axios from 'axios';

class WeatherPanel extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.getWeather = this.getWeather.bind(this);
    }

    getWeather() {
        axios.post('get_weather', {lat: this.props.loc[0], lng: this.props.loc[1]}).then(res => {
            if (!res.data.icon) {
                res.data.icon = 'na';
            }
            this.setState({weather: res.data});
        });
    }

    render() {
        if (!this.state.weather) {
            this.getWeather();
            return(
                <div>
                    <nav className="navbar navbar-light bg-light adjust-navbar">
                        <span className="nav-item" id="data-title">Weather Data</span>
                    </nav>
                    <div className="container">
                        <img id="weather-icon" src="img/watson-thinking.gif"/>
                            <h3 id="weather-title">Getting weather...</h3>
                    </div>
                    <div className="container">
                    </div>
                </div>
            );
        } else {
            return (
                <div>
                    <nav className="navbar navbar-light bg-light adjust-navbar">
                        <span className="nav-item" id="data-title">Weather Data</span>
                    </nav>
                    <div className="container">
                        <img id="weather-icon" src={"img/wicon/" + this.state.weather.icon + ".svg"}/>
                            <h3 id="weather-title">{this.state.weather.phrase}</h3>
                    </div>
                    <div className="container">
                        <p id="weather-details">Avg. Temperature (last 24 hrs): {Math.round(this.state.weather.avg_temp)} degrees. Avg. Hourly Precip (last 24 hrs): {Math.round(this.state.weather.avg_precip)} inches</p>
                    </div>
                </div>
            );
        }
    }
}

export default WeatherPanel;