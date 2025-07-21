import axios from 'axios';

const removeAsset = async(assetId) => {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = '/login'; // Redireciona para login se não houver token
    return;
  };
  return await axios.delete(`http://localhost:3000/api/assets/${assetId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export default removeAsset;