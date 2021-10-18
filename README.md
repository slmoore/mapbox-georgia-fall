# Georgia's Best Fall Foliage Destinations

Displays an interactive map of the best locations in Georgia to see fall colors.

### Preview

- [Georgia Fall Color Destinations](https://dev.d2esqyvghkr10u.amplifyapp.com/)

### Purpose

- Experiment with Mapbox API and structure on an application that can benefit others in my home state by visualizing where the best Georgia fall colors are located and the time of the year to see them.

### Using

- **MapboxGL** for map creation and interactions.
- **AWS Amplify** for serverless backend and deployment.
- **React** for components and app presentation.
- **Redux** for app state management.

### Features

- Toggle between the months October and November to find the best destinations at that time.
- Select a fall map icon (leaf) and a popup will identify the location.  It will also scroll the sidebar to the full description including an image of the fall colors.
- Select a location on the sidebar to open a popup on the map showing where the sidebar destination is located.
- Enter fullscreen mode by selecting the fullscreen button on the top right corner of the map.
- Detects mapbox compatible browsers.

### Testing

- tested manually on Chrome, will extend to unit/integration testing and other browsers in time.

### Launch locally

- Clone repo.
- Signup with Mapbox to get your public api key.
- Create `.env` file in root directory with key/value pairs `PORT` (port number), `MBTKN` (your public api key), `MBSTL` (chosen mapbox style), `REACT_APP_LOCAL` (set to true; only for local development; toggles backend to local service).
- Open 2 terminal tabs to the workspace, on one run `npm start` and the other run `npm run serve`.
- Visit `http://localhost:PORT/` where port is your port number.

### Reference

- Thanks to [Georgia State Parks](https://gastateparks.org/LeafWatch) for the excellent recommendations.

### Next steps

- expand features to include trails and fall color polygon overlays
- integration testing
- improved styles
- typescript integration
- GraphQL API