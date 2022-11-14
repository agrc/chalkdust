import { getAnalytics } from 'firebase/analytics';
import PropTypes from 'prop-types';
import { ErrorBoundary } from 'react-error-boundary';
import { AnalyticsProvider, useFirebaseApp } from 'reactfire';
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
  const app = useFirebaseApp();
  const analytics = getAnalytics(app);

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <AnalyticsProvider sdk={analytics}>
        <div className="w-screen h-screen">
          <Header title="Chalkdust Redline Viewer" version={version ?? '1.0.0'} />
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <MapView />
          </ErrorBoundary>
        </div>
      </AnalyticsProvider>
    </ErrorBoundary>
  );
}

export default App;
