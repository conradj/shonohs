export default props => (
  <div className="max-w-sm rounded overflow-hidden shadow-lg">
    <img
      className="w-full"
      src={props.imageUrl ? props.imageUrl : "/placeholder.png"}
      alt={props.name}
    />

    <div className="px-6 py-4">
      <div className="font-bold text-xl mb-2">{props.name}</div>
      <div className="text-gray-700 text-base">{props.children}</div>
    </div>
    <div className="px-6 py-4 h-32 max-h-full">
      {props.tags.map(tag => (
        <span
          key={tag.id}
          className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
        >
          {tag.name}
        </span>
      ))}
    </div>
  </div>
);
