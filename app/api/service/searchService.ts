export const searchServices = async (params: {
	name?: string;
	description?: string;
	estimateTimeMin?: any;
	estimateTimeMax?: number;
	priceMin?: number;
	priceMax?: number;
	serviceType?: number;
}) => {
	try {
		const query = new URLSearchParams();

		if (params.name) query.append('name', params.name);
		if (params.description) query.append('description', params.description);
		if (params.estimateTimeMin) query.append('estimateTimeMin', params.estimateTimeMin.toString());
		if (params.estimateTimeMax) query.append('estimateTimeMax', params.estimateTimeMax.toString());
		if (params.priceMin) query.append('priceMin', params.priceMin.toString());
		if (params.priceMax) query.append('priceMax', params.priceMax.toString());
		if (params.serviceType) query.append('serviceType', params.serviceType.toString());

		const response = await fetch(`https://52.187.14.110/api/service/search?${query.toString()}`);
		if (!response.ok) {
			throw new Error('Failed to fetch search results');
		}
		const data = await response.json();
		console.log('Search response:', data);
		return data;
	} catch (error) {
		console.error('Error fetching search results:', error);
		throw error;
	}
};
