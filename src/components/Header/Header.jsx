import PropTypes from 'prop-types';
import logo from './ugrc_logo.png';

export default function Header({ title, version }) {
  return (
    <div className="z-10 bg-white p-3">
      <h1 className="text-5xl font-bold text-gray-700">
        <span>{title}</span>
        <a
          className="-ml-5 align-bottom text-xs leading-tight font-normal tracking-tight text-blue-400 hover:font-bold hover:text-blue-600"
          style={{ verticalAlign: 'sub' }}
          href={`https://github.com/agrc/chalkdust/releases/v${version}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {version}
        </a>
        <img src={logo} className="absolute top-1 right-1 focus:ring-0" alt="utah geospatial resource center logo" />
      </h1>
    </div>
  );
}
Header.propTypes = {
  title: PropTypes.string.isRequired,
  version: PropTypes.string.isRequired,
};
