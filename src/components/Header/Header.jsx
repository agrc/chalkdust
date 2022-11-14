import PropTypes from 'prop-types';
import logo from './ugrc_logo.png';

export default function Header({ title, version }) {
  return (
    <div className="bg-white p-3 z-10">
      <h1 className="text-5xl font-bold text-gray-700">
        <span>{title}</span>
        <a
          className="hover:font-bold hover:text-blue-600 text-blue-400 text-xs font-normal align-bottom leading-tight tracking-tight -ml-5"
          style={{ verticalAlign: 'sub' }}
          href={`https://github.com/agrc/chalkdust/releases/v${version}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {version}
        </a>
        <img src={logo} className="focus:ring-0 absolute right-1 top-1" alt="utah geospatial resource center logo" />
      </h1>
    </div>
  );
}
Header.propTypes = {
  title: PropTypes.string.isRequired,
  version: PropTypes.string.isRequired,
};
