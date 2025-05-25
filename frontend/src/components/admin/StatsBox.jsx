function StatsBox({ title, count }) {
  return (
    <div className="bg-blue-100 p-4 rounded-xl shadow">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-2xl">{count}</p>
    </div>
  );
}

export default StatsBox;
