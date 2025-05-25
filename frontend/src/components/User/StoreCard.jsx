import { useNavigate } from 'react-router-dom';

function StoreCard({ store }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/user/store/${store.id}/rating`);
  };

  return (
    <div
      onClick={handleClick}
      className="p-4 border rounded shadow-sm hover:shadow-md transition cursor-pointer"
    >
      <h3 className="text-lg font-semibold text-blue-600">{store.name}</h3>
      <p className="text-sm text-gray-600">{store.address}</p>
      <p className="text-sm mt-1">
        Average Rating: <b>{store.average_rating}</b>
      </p>
    </div>
  );
}

export default StoreCard;
