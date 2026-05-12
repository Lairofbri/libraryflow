using LibraryFlow.Application.DTOs;
using LibraryFlow.Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace LibraryFlow.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController(AuthService authService) : ControllerBase
{
    private readonly AuthService _authService = authService;

    // POST /api/auth/register
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto dto)
    {
        var response = await _authService.RegisterAsync(dto);
        return Ok(response);
    }

    // POST /api/auth/login
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
        var response = await _authService.LoginAsync(dto);
        return Ok(response);
    }
}