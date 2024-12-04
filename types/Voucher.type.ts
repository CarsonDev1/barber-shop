type VoucherData = {
	id: number;
	code: string;
	maxUses: number;
	discount: number;
	maxDiscount: number;
	startDate: string;
	endDate: string;
	minPrice: number;
	disabled: boolean;
};

type ApiResponseVoucher = {
	status: number;
	message: string;
	payload: VoucherData[];
};
