import { ErrorBoundary } from 'react-error-boundary';
import MapView from './components/Mapping/MapView';
import Header from './components/Header';

const version = import.meta.env.VITE_VERSION;

const ErrorFallback = ({ error }) => {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre style={{ color: 'red' }}>{error.message}</pre>
    </div>
  );
};
function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <div className="w-screen h-screen">
        <Header title="Chalkdust Redline Viewer" version={version || '1.0.0'} />
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <MapView />
        </ErrorBoundary>
      </div>
    </ErrorBoundary>
  );
}

export default App;
