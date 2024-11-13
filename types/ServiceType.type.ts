export type ServiceImage = {
	id: number;
	name: string;
	url: string;
	thumbUrl: string;
	mediumUrl: string;
	createdAt: string;
	updatedAt: string;
};

export type Service = {
	id: number;
	name: string;
	description: string;
	price: number;
	estimateTime: number;
	images: ServiceImage[];
	createdAt: string;
	updatedAt: string;
};

export type ServiceType = {
	id: number;
	name: string;
	services: Service[];
	createdAt: string;
	updatedAt: string;
};

export type ApiResponseServiceType = {
	status: number;
	message: string;
	payload: ServiceType[];
};
