import React, {Component} from 'react';

import './App.css';
import Card from "@material-ui/core/Card";
import {observer} from "mobx-react";

@observer
class App extends Component {
    componentDidMount() {
        this.props.store.load();
    }

    render() {
        return (
            <div>
                <Card>
                    {JSON.stringify(this.props.store.state)}
                </Card>
            </div>
        );
    }
}

export default App;
