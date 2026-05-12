namespace LibraryFlow.Application.DTOs;

public class AuthResponseDto
{
    public string AccessToken { get; set; } = string.Empty;
    public string TokenType { get; set; } = "Bearer";
    public int ExpiresIn { get; set; } = 900; // 15 minutos en segundos
    public UserDto User { get; set; } = null!;
}