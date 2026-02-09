using Backend.DTOs.Promotion;
using Backend.Helper;

namespace Backend.Services.Interfaces
{
    public interface IPromotionServices
    {
        public Task<Result> PromotionStudents(List<PromotionDto> dto);
    }
}
