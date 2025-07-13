const Avatar = ({ name }) => {
  const stringToColor = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = hash % 360;
    return `hsl(${hue}, 65%, 55%)`;
  };

  const bgColor = stringToColor(name || "U");

  return (
    <div
      className="w-9 h-9 rounded-full text-white flex items-center justify-center text-lg font-semibold uppercase shadow"
      style={{ backgroundColor: bgColor }}
    >
      {name?.charAt(0) || "?"}
    </div>
  );
};

export default Avatar;
