using Backend.DTOs.Promotion;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
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

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> Promotion([FromBody] List<PromotionDto> dto)
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
