using Backend.DTOs;
using Backend.Helper;

namespace Backend.Services.Interfaces
{
    public interface IPromotionServices
    {
        public Task<Result> PromotionStudents(PromotionList dto);
    }
}
