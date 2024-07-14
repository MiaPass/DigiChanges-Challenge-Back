export default interface StarWars {
	create(data: object): object;
	getAll(paginate: any): object;
	getById(id: string): object;
	getFiltered(paginate: any, field: any, value: any): object;
	delete(): object;
}
