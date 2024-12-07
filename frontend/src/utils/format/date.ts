import { pluralize } from "../locale/pluralize";
import { dateFormats } from "./date-formats";

export const formatDate = (
  date: string | Date,
  format: keyof typeof dateFormats = "ddMMyyyyHHmm",
  showDateIfNotToday = false,
) => {
  const d = typeof date === "string" ? new Date(date) : date;
  const isToday = d.toDateString() === new Date().toDateString();
  if (showDateIfNotToday && !isToday) {
    return d.toLocaleDateString("ru-RU", { dateStyle: "medium" });
  }
  return new Intl.DateTimeFormat("ru-RU", dateFormats[format]).format(d);
};

export const formatDistanceToNow = (
  pastDate: Date,
  short?: boolean,
): string => {
  const now = new Date();
  const diffMs = now.getTime() - pastDate.getTime();

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (days > 0) {
    return `${days} ${short ? "d" : pluralize(days, ["день", "дня", "дней"])} назад`;
  }
  if (hours > 0) {
    return `${hours} ${short ? "h" : pluralize(hours, ["час", "часа", "часов"])} назад`;
  }
  if (minutes > 0) {
    return `${minutes} ${short ? "min" : pluralize(minutes, ["минута", "минуты"])} назад`;
  }
  if (seconds > 30) {
    return `около минуты назад`;
  }

  return "меньше минуты назад";
};
