import axios from 'axios';


function updateAsset(assetId, updatedAsset) {
    return axios.put(`/api/assets/${assetId}`, updatedAsset);
}

export default updateAsset;