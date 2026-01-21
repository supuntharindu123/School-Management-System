using Backend.DTOs;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PromotionController:Controller
    {
        private readonly IPromotionServices _promotionServices;
        public PromotionController(IPromotionServices promotionServices) {
            _promotionServices = promotionServices;
        }

        [HttpPost]
        public async Task<IActionResult> Promotion(PromotionList dto)
        {
            var res=await _promotionServices.PromotionStudents(dto);

            if(!res.IsSuccess)
            {
                return BadRequest(res);
            }

            return Ok("Student Promotion Successfully !");
        }
    }
}
