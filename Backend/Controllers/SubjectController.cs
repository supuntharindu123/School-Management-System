using Backend.Models;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SubjectController : ControllerBase
    {
        private readonly ISubjectService _services;
        private readonly ISubjectGradeService _subjectGradeService;

        public SubjectController(ISubjectService services, ISubjectGradeService subjectGradeService)
        {
            _services = services;
            _subjectGradeService = subjectGradeService;
        }

        [HttpPost]
        public async Task<IActionResult> AddSubject(Subject subject)
        {
            var res = await _services.AddSubject(subject);
            if (!res.IsSuccess)
            {
                return BadRequest(res.Error);
            }

            return Ok("Subject Adding Successfully!");
        }

        [HttpGet]
        public async Task<IActionResult> GetSubjects()
        {
            var res = await _services.GetSubjects();

            if (!res.IsSuccess)
            {
                return BadRequest(res.Error);
            }

            return Ok(res.Data);

        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetSubjectById(int id)
        {
            var res = await _services.GetSubjectByID(id);

            if (!res.IsSuccess)
            {
                return NotFound(res.Error);
            }

            return Ok(res.Data);

        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateSubject(int id,Subject subject)
        {
            var res = await _services.UpdateSubject(id,subject);

            if (!res.IsSuccess)
            {
                return BadRequest(res.Error);
            }

            return NoContent();

        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Remove(int id)
        {
            var res = await _services.RemoveSubject(id);

            if (!res.IsSuccess)
            {
                return BadRequest(res.Error);
            }

            return NoContent();

        }

        [HttpPost("/grade")]
        public async Task<IActionResult> AddSubjectGrade(SubjectGrade subjectGrade)
        {
            var res=await _subjectGradeService.Add(subjectGrade);

            if(!res.IsSuccess)
            {
                return BadRequest(res.Error);
            }

            return Ok("Subject assigned to grade successfully");
        }

        [HttpGet("/grade/{id}")]
        public async Task<IActionResult> GetSubjectGradeById(int id)
        {
            var res = await _subjectGradeService.GetById(id);

            if (!res.IsSuccess)
            {
                return BadRequest(res.Error);
            }

            return Ok(res.Data);
        }

        [HttpGet("/grade/grade/{id}")]
        public async Task<IActionResult> GetSubjectGradeByGradeId(int id)
        {
            var res = await _subjectGradeService.GetByGrade(id);

            if (!res.IsSuccess)
            {
                return NotFound(res.Error);
            }

            return Ok(res.Data);
        }


        [HttpDelete("/grade/{id}")]
        public async Task<IActionResult> RemoveSubjectGrade(int id)
        {
            var res = await _subjectGradeService.Remove(id);

            if (!res.IsSuccess)
            {
                return NotFound(res.Error);
            }

            return NoContent();
        }
    }
}
