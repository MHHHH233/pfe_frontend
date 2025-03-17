const terrainEndpoints = {
  getAllTerrains: '/api/admin/v1/terrains',
  getTerrain: (id) => `/api/admin/v1/terrains/${id}`,
  createTerrain: '/api/admin/v1/terrains',
  updateTerrain: (id) => `/api/admin/v1/terrains/${id}`,
  deleteTerrain: (id) => `/api/admin/v1/terrains/${id}`,
};

export default terrainEndpoints; 