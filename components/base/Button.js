export default props => (
  <button
    {...props}
    className={`bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded ${props.className}`}
  >
    {props.children}
  </button>
);
