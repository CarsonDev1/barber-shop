type Image = {
	id: number;
	name: string;
	url: string;
	thumbUrl: string;
	mediumUrl: string;
	createdAt: string;
	updatedAt: string;
};

type Service = {
	id: number;
	name: string;
	description: string;
	price: number;
	estimateTime: number;
	images: Image[];
	createdAt: string;
	updatedAt: string;
};

type Combo = {
	id: number;
	name: string;
	description: string;
	price: number;
	estimateTime: number;
	images: Image[];
	services: Service[];
	createdAt: string;
	updatedAt: string;
};

type ApiResponseCombo = {
	status: number;
	message: string;
	payload: Combo[];
};
