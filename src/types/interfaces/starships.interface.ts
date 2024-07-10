interface StarshipFeature {
	manufacturer: string;
	cost_in_credits: string;
	length: string;
	max_atmosphering_speed: string;
	crew: string;
	passengers: string;
	cargo_capacity: string;
	consumables: string;
	hyperdrive_rating: string;
	class: string;
}

export default interface StarshipInterface {
	_id?: string;
	name: string;
	starship_model: string;
	category: string;
	features: StarshipFeature;
	pilots: string[];
	films: string[];
	url: string;
}
