export const Balance = ({ balance }) => {
  return (
    <div className="p-4 rounded-xl font-semibold">
      Your Balance: {balance === null || balance === undefined ? "Loading..." : `$${Number(balance).toFixed(2)}`}
    </div>
  );
};
