import { axiosClient } from "@util/axiosClient";
import { ResponseDto } from "@api/dto/responseDto";
import { NotificationListDto } from "@api/dto/notification";

const apiUrl = process.env.REACT_APP_API_URL;

export const getNotificationList = async (
): Promise<ResponseDto<NotificationListDto[]>> => {
  console.log('getNotificationList');
  const url = `${apiUrl}/notifications/list`;
  const res = await axiosClient.get<ResponseDto<NotificationListDto[]>>(url);
  return res.data;
};

export const patchUpdateReadNoti = async (
    notificationId: number
  ): Promise<ResponseDto<boolean>> => {
    console.log('patchUpdateReadNoti');
    const url = `${apiUrl}/notifications/read/${notificationId}`;
    const res = await axiosClient.patch<ResponseDto<boolean>>(url);
    return res.data;
  };