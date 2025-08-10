export default function urlCodeText(value: string) {
  return encodeURIComponent(value).replace(/%20/g, "+");
}
