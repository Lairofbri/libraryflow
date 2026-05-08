using LibraryFlow.Application.DTOs;
using LibraryFlow.Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace LibraryFlow.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReservationsController(ReservationService reservationService) : ControllerBase
{
    private readonly ReservationService _reservationService = reservationService;

    // GET /api/reservations
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var reservations = await _reservationService.GetAllAsync();
        return Ok(reservations);
    }

    // POST /api/reservations
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateReservationDto dto)
    {
        var created = await _reservationService.CreateAsync(dto);
        return CreatedAtAction(nameof(GetAll), new { id = created.Id }, created);
    }
}