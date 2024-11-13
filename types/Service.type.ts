export type ServiceType = {
	id: number;
	name: string;
	createdAt: string;
	updatedAt: string;
};

export type Image = {
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
	serviceType: ServiceType;
	images: Image[];
	createdAt: string;
	updatedAt: string;
};

export type ServiceResponse = {
	status: number;
	message: string;
	payload: Service[];
};
