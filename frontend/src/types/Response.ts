export default interface Response<T> {
  data?: {
    payload: T;
  };
  error?: string;
}
