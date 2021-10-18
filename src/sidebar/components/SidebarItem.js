import { Component, createRef } from "react";
import PropTypes from 'prop-types';

/**
 * Sidebar Item component for individual destinations
 */
class SidebarItem extends Component {
    constructor(props) {
        super(props);
        this.itemRef = createRef();
        this.handleClick = this.handleClick.bind(this);
    }

    /**
     * Mount lifecycle method
     * Scroll selected destination into view
     */
    componentDidMount() {
        if (this.props.selected === this.props.featureId) {
            this.itemRef.current.scrollIntoView(true);
        }
    }

    /**
     * Updated lifecycle method
     * Scroll selected destination into view
     */
    componentDidUpdate() {
        if (this.props.selected === this.props.featureId) {
            this.itemRef.current.scrollIntoView(true);
        }
    }

    /**
     * Handle sidebar click DOM events by dispatching a point selected action
     * 
     * @param {Event} event 
     */
    handleClick(event) {
        event.preventDefault();
        this.props.pointSelected(this.props.featureId);
    }

    /**
     * Render Sidebar Item component
     * 
     * @returns {JSX}
     */
    render() {
        const {title, image, description, address} = this.props;

        return (
            <li className="sidebar__item" ref={this.itemRef} onClick={this.handleClick} >
                <div className="sidebar__item__block">
                    <h3 className="sidebar__item__title">{title}</h3>
                    <img className="sidebar__item__image" src={image} alt={`fall colors of ${title}`} />
                    <p className="sidebar__item__description">{description}</p>
                    <p className="sidebar__item__address">{address}</p>
                </div>
            </li>
        );
    }
}

SidebarItem.propTypes = {
    title: PropTypes.string.isRequired,
    image: PropTypes.string,
    description: PropTypes.string,
    address: PropTypes.string
}

export default SidebarItem;