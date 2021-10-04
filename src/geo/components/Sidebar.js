import {Component} from "react";

// ! loading message when sidebar is changing

class Sidebar extends Component {
    constructor(props) {
        super(props);
        this.refCollection = {};
    }

    componentDidUpdate(prevProps) {
        if (this.props.selected === prevProps.selected || !this.refCollection[this.props.selected]) {
            return;
        }
        this.refCollection[this.props.selected].scrollIntoView(true);
    }

    render() {
        const {dataset} = this.props;

        const sideBarItems = dataset?.features?.map((item) => {
            const { id, address, title, description, image } = item.properties;
            // callback ref closure
            const setRef = (element) => {
                if (!element) {
                    return;
                }
        
                this.refCollection[id] = element;
            }

            return (
                <li key={id} ref={setRef}>
                    <h3>{title}</h3>
                    <p>{description}</p>
                    <img src={image} alt={`fall colors of ${title}`} />
                    <p>{address}</p>
                </li>
            );
        }) || [];

        return (
            <section className="sidebar">
                <ul className="sidebar__list">{sideBarItems}</ul>
            </section>
        );
    }
}


export default Sidebar;