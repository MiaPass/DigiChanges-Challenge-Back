export default interface StarWars {
	create(data: object): object;
	getAll(paginate: any): object;
	getById(id: string): object;
	getFiltered(paginate: any, data: object): object;
	delete(): object;
}
