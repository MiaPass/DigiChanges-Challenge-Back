interface FilmFeature {
	director: string;
	producer: string;
	release_date: Date;
}

export default interface FilmInterface {
	_id?: any;
	name: string;
	episode: number;
	features: FilmFeature;
	characters: string[];
	planets: string[];
	starships: string[];
	url: string;
}
