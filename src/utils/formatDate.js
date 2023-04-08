export default function formatDate(date) {
  const getDate = new Date(date * 1000);
  const formatDate = new Date(getDate).toLocaleDateString("vi-VI");
  return formatDate;
}
