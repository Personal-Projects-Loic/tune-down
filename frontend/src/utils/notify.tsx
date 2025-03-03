import { showNotification, NotificationsProps } from "@mantine/notifications";

type NotificationType = "success" | "error" | "info" | "warning";

interface NotifyOptions extends Omit<NotificationsProps, "message"> {
  message: string;
  type: NotificationType;
}

const colorMap: Record<NotificationType, string> = {
  success: "green",
  error: "red",
  info: "blue",
  warning: "yellow",
};

export const notify = ({ title, message, type }: NotifyOptions) => {
  const color = colorMap[type];

  showNotification({
    color,
    title,
    message,
  });
};
