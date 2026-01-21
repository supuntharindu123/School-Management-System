namespace Backend.Helper
{
    public class Result<T> : Result
    {
        public T? Data { get; }
        public Result(bool isSuccess,T? data, string? error) : base(isSuccess, error)
        {
            Data = data;
        }

        public static Result<T> Success(T data)
        {
            return new Result<T> (true, data ,null);
        }

        public static new Result<T> Failure(string error)
        {
            return new Result<T>(false, default, error);
        }
    }
}
