import api from '@/utils/api';

interface VoucherData {
	code: string;
	maxUses: number;
	discount: number;
	maxDiscount: number;
	startDate: string;
	endDate: string;
	minPrice: number;
	disabled: boolean;
}

export const createVoucher = async (voucherData: VoucherData) => {
	return await api.post('/voucher', voucherData, {
		headers: {
			'Content-Type': 'application/json',
		},
	});
};
