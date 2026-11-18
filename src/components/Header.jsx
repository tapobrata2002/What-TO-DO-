
function Header({
  title = 'WHAT TO-DO?',
  subtitle = 'Organize your day, one task at a time.',
  logoSrc = '/logo.svg',
}) {
  return (
    <header className="app-header">
      <img
        src={logoSrc}
        alt={`${title} logo`}
        className="app-logo"
      />

      <div className="header-title">
        <h1>{title}</h1>
      </div>

      <div
        className="header-spacer"
        aria-hidden="true"
      ></div>

      <p>{subtitle}</p>
    </header>
  );
}

export default Header;
