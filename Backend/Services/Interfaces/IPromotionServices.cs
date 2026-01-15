using Backend.DTOs;

namespace Backend.Services.Interfaces
{
    public interface IPromotionServices
    {
        public Task PromotionStudents(PromotionList dto);
    }
}
