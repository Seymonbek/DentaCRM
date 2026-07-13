/**
 * Notifications API — mirrors `/api/v1/notifications/`.
 */
import { request } from "./client";
import type { Paginated, NotificationLog } from "@/types";

export interface NotificationListParams {
  page?: number;
  pageSize?: number;
  status?: string;
  type?: string;
  unreadOnly?: boolean;
}

function buildParams(input: NotificationListParams): Record<string, string> {
  const params: Record<string, string> = {};
  if (input.page && input.page > 0) params["page"] = String(input.page);
  if (input.pageSize && input.pageSize > 0) params["page_size"] = String(input.pageSize);
  if (input.status) params["status"] = input.status;
  if (input.type) params["type"] = input.type;
  if (input.unreadOnly) params["unread_only"] = "true";
  return params;
}

export function listNotifications(
  input: NotificationListParams = {},
): Promise<Paginated<NotificationLog>> {
  return request<Paginated<NotificationLog>>({
    method: "GET",
    url: "/notifications/",
    params: buildParams(input),
  });
}

export function getNotification(id: string): Promise<NotificationLog> {
  return request<NotificationLog>({
    method: "GET",
    url: `/notifications/${id}/`,
  });
}
