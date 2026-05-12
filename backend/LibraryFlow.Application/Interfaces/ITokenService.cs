using LibraryFlow.Domain.Entities;

namespace LibraryFlow.Application.Interfaces;

public interface ITokenService
{
    string GenerateToken(User user);
    int GetUserIdFromToken(string token);
}