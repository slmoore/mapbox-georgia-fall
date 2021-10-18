import SidebarList from "./SidebarList";
import PropTypes from 'prop-types';

/**
 * Sidebar component displaying destination details
 * 
 * @param {Object} props 
 * @returns {JSX}
 */
const Sidebar = (props) => {
    return (
        <section className="sidebar">
            <SidebarList dataset={props.dataset} month={props.month} selected={props.selected} pointSelected={props.pointSelected} />
        </section>
    );
};

Sidebar.propTypes = {
    dataset: PropTypes.object.isRequired,
    month: PropTypes.string.isRequired,
    selected: PropTypes.number.isRequired,
    pointSelected: PropTypes.func.isRequired
}

export default Sidebar;