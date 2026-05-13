using LibraryFlow.Application.DTOs;
using LibraryFlow.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LibraryFlow.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Bibliotecario")]
public class UsersController(UserService userService) : ControllerBase
{
    private readonly UserService _userService = userService;

    // GET /api/users
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var users = await _userService.GetAllAsync();
        return Ok(users);
    }

    // GET /api/users/{id}
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var user = await _userService.GetByIdAsync(id);
        return Ok(user);
    }

    // POST /api/users
    [HttpPost]
    public async Task<IActionResult> CreateBibliotecario([FromBody] CreateUserDto dto)
    {
        var created = await _userService.CreateBibliotecarioAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    // PUT /api/users/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateUserDto dto)
    {
        var updated = await _userService.UpdateAsync(id, dto);
        return Ok(updated);
    }
}