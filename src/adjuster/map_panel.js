import React, {Component} from 'react';
import { Map, TileLayer, Marker, Popup, Tooltip } from 'react-leaflet';

class MapPanel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            lat: 51.505,
            lng: -0.09,
            zoom: 13
        };
    }
    render() {
        const loss_location = this.props.loss_location;
        return (
            <div>
                <nav className="navbar navbar-light bg-light adjust-navbar">
                    <span className="nav-item" id="data-title">Map Data</span>
                </nav>
                <div className="container">
                    <Map center={this.props.loss_location} zoom={this.state.zoom}>
                        <TileLayer
                            attribution='<img src="https://locate.pitneybowes.com/en/pitneyboweslogo.png">'
                            url='https://api.pitneybowes.com/location-intelligence/geomap/v1/tile/osm/{z}/{x}/{y}.png?api_key=vxwrnbwUOU0FTE3izm5t1Xa3QA8j4WDA&theme=bronze'
                        />
                        <Marker position={loss_location}>
                            <Tooltip permanent="true">
                                Loss Location
                            </Tooltip>
                        </Marker>
                        <Marker position={this.props.home_location}>
                            <Tooltip permanent="true">
                                Home Location
                            </Tooltip>
                        </Marker>
                        <Marker position={this.props.office_location}>
                            <Tooltip permanent="true">
                                Work Location
                            </Tooltip>
                        </Marker>
                    </Map>
                </div>
            </div>
        );
    }
}

export default MapPanel;