interface PlanetFeature {
	rotation_period: string;
	orbital_period: string;
	diameter: string;
	climate: string;
	gravity: string;
	terrain: string;
	surface_water: string;
	population: string;
}

export default interface PlanetInterface {
	_id?: any;
	name: string;
	features: PlanetFeature;
	films: string[];
	url: string;
}
