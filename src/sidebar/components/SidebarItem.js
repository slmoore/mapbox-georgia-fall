import { Component, createRef } from "react";
import PropTypes from 'prop-types';

class SidebarItem extends Component {
    constructor(props) {
        super(props);
        this.itemRef = createRef();
        this.handleClick = this.handleClick.bind(this);
    }

    componentDidMount() {
        if (this.props.selected === this.props.featureId) {
            this.itemRef.current.scrollIntoView(true);
        }
    }

    componentDidUpdate() {
        if (this.props.selected === this.props.featureId) {
            this.itemRef.current.scrollIntoView(true);
        }
    }

    handleClick(event) {
        event.preventDefault();
        this.props.pointSelected(this.props.featureId);
    }

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