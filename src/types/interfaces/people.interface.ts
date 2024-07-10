interface PersonFeature {
	height: string;
	mass: string;
	hair_color: string;
	skin_color: string;
	eye_color: string;
	birth_year: string;
	gender: string;
}

export default interface PersonInterface {
	_id?: any;
	name: string;
	features: PersonFeature;
	planet: string;
	films: string[];
	starships: string[];
	url: string;
}
