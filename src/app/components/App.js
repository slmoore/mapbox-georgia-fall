import '../styles/App.css';
import '../../geo/styles/Geo.css';
import '../../sidebar/styles/Sidebar.css';
import { actionMonthChanged, actionPointSelected } from '../state/actions';
import { Component } from 'react';
import { connect } from 'react-redux';
import Map from '../../geo/components/Map';
import Sidebar from '../../sidebar/components/Sidebar';
import PropTypes from 'prop-types';

/**
 * 
 * -------------------------------------------
 * | title         |        | filter Oct Nov |
 * | image         |        |----------------|
 * | description   |                         |
 * | address       |  Map with Icons         |
 * |               |  First is pre-selected  |
 * |               |                         |
 * |               |                         |
 * |               |                         |
 * |               |                         |
 * |               |                         |
 * |               |                         |
 * |------------------------------------------
 * 
 */


const mapStateToProps = (state) => {
  return {
    month: state.app.month,
    selected: state.app.selected,
    dataset: state.app.dataset
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    monthChanged: (data) => { dispatch(actionMonthChanged(data)) },
    pointSelected: (data) => { dispatch(actionPointSelected(data)) }
  }
};

class App extends Component {
  constructor(props) {
    super(props);
    this.handleMonthChange = this.handleMonthChange.bind(this);
  }

  handleMonthChange(event) {
    if (this.props.month === event.target.value) {
      return;
    }

    this.props.monthChanged(event.target.value);
  }

  render() {
    const { handleMonthChange } = this;
    const { dataset, month, selected, pointSelected } = this.props;

    return (
      <div className="app">
        <Sidebar dataset={dataset} month={month} selected={selected} pointSelected={pointSelected} />
        <Map handleMonthChange={handleMonthChange} pointSelected={pointSelected} />
      </div>
    );
  }
}

App.propTypes = {
  dataset: PropTypes.object.isRequired,
  month: PropTypes.string.isRequired,
  selected: PropTypes.number.isRequired,
  pointSelected: PropTypes.func.isRequired
}

// Redux connected App
export default connect(mapStateToProps, mapDispatchToProps)(App);
