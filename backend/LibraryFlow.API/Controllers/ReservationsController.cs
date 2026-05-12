using System.Security.Claims;
using LibraryFlow.Application.DTOs;
using LibraryFlow.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LibraryFlow.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ReservationsController(ReservationService reservationService) : ControllerBase
{
    private readonly ReservationService _reservationService = reservationService;

    // GET /api/reservations
    // Bibliotecario ve todas, Cliente ve solo las suyas
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var role = User.FindFirst(ClaimTypes.Role)?.Value;
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        var reservations = role == "Bibliotecario"
            ? await _reservationService.GetAllAsync()
            : await _reservationService.GetByUserIdAsync(userId);

        return Ok(reservations);
    }

    // POST /api/reservations
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateReservationDto dto)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        var created = await _reservationService.CreateAsync(dto, userId);
        return CreatedAtAction(nameof(GetAll), new { id = created.Id }, created);
    }

    // PUT /api/reservations/{id}/return
    [HttpPut("{id}/return")]
    public async Task<IActionResult> Return(int id)
    {
        var role = User.FindFirst(ClaimTypes.Role)?.Value;
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        // Bibliotecario puede devolver cualquier reserva
        var effectiveUserId = role == "Bibliotecario" ? 0 : userId;
        var returned = await _reservationService.ReturnAsync(id, effectiveUserId, role == "Bibliotecario");

        return Ok(returned);
    }
}