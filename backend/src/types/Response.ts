export default interface Response<T> {
  payload?: T;
  error?: string;
}
