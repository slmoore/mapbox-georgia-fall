# Georgia's Best Fall Foliage Destinations

Displays an interactive map of the best locations in Georgia to see fall colors.

### Preview

- ...

### Purpose

- Experiment with Mapbox API and structure on an application that can benefit others in my home state.

### Features

- Toggle between the months October and November to find the best destinations at that time.
- Select a fall map icon (leaf) and a popup will identify the location.  It will also scroll the sidebar to the full description including an image of the fall colors.
- Select a location on the sidebar to open a popup on the map showing where the sidebar destination is located.
- Detects mapbox compatible browsers.

### Using

- MapboxGL
- React
- Redux

### Testing

- tested manually on Chrome, will extend to unit/integration testing and other browsers in time.

### Launch locally

- Clone repo.
- Signup with Mapbox to get your public api key.
- Create `.env` file in root directory with key/value pairs `PORT` (port number), `MBTKN` (your public api key), `MBSTL` (chosen mapbox style).
- Then run `npm run build && npm run serve` and visit `http://localhost:PORT/` where port is your port number.

### Reference

- [Georgia State Parks](https://gastateparks.org/LeafWatch)

### Next steps

- expand features to include trails and fall color polygon overlays
- unit testing and accessibility testing
- code comments, styles with postcss