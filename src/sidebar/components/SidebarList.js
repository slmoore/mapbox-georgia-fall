import SidebarItem from "./SidebarItem";
import PropTypes from 'prop-types';

const SidebarList = (props) => {
    const { dataset, month, selected, pointSelected } = props;

    const sideBarItems = dataset[month].features?.map((item) => {
        const { id, address, title, description, image } = item.properties;

        return (
            <SidebarItem key={id} selected={selected} pointSelected={pointSelected} featureId={id} address={address} title={title} description={description} image={image} />
        );
    }) || [];

    return (
        <ul className="sidebar__list">{sideBarItems}</ul>
    )
};

SidebarList.propTypes = {
    dataset: PropTypes.object.isRequired,
    month: PropTypes.string.isRequired,
    selected: PropTypes.number.isRequired,
    pointSelected: PropTypes.func.isRequired
}

export default SidebarList;