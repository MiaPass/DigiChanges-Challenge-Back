export default interface StarWars {
	create(data: object): object;
	getAll(): object;
	getById(id: string): object;
	getFiltered(data: object): object;
	update(id: string, data: object): object;
	delete(): object;
}
