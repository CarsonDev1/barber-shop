import { UserProfile } from "@/types/Profile.type";
import api from "@/utils/api";

export const updateProfile = async (profileData: UserProfile) => {
  try {
    const response = await api.put('/users/profile', profileData);
    return response.data;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};