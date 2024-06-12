import PropTypes from 'prop-types';
import { ErrorBoundary } from 'react-error-boundary';
import Header from './components/Header';
import MapView from './components/Mapping/MapView.jsx';

const version = import.meta.env.PACKAGE_VERSION;

const ErrorFallback = ({ error }) => {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre style={{ color: 'red' }}>{error.message}</pre>
    </div>
  );
};
ErrorFallback.propTypes = {
  error: PropTypes.object.isRequired,
};

function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <div className="w-screen h-screen">
        <Header title="Chalkdust Redline Viewer" version={version ?? '1.0.0'} />
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <MapView />
        </ErrorBoundary>
      </div>
    </ErrorBoundary>
  );
}

export default App;
