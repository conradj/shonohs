export default ({
  children,
  connection: { connected, loginUrl, loginMessage, badgeClass }
}) => (
  <div className="flex flex-row connection p-1">
    <div
      className={`${badgeClass} text-white inline-block rounded-full px-3 py-1 text-sm font-semibold mr-2`}
    >
      {children}
    </div>
    <div className="align-middle px-3 py-1">
      {connected ? (
        <span className="text-green-800">Connected</span>
      ) : (
        <a href={loginUrl}>{loginMessage || "Connect Now"}</a>
      )}
    </div>
  </div>
);
