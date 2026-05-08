using LibraryFlow.Application.Interfaces;
using LibraryFlow.Infrastructure.Data;
using Microsoft.EntityFrameworkCore.Storage;

namespace LibraryFlow.Infrastructure;

public class UnitOfWork(LibraryFlowDbContext context) : IUnitOfWork
{
    private readonly LibraryFlowDbContext _context = context;
    private IDbContextTransaction? _transaction;

    public async Task BeginTransactionAsync()
    {
        _transaction = await _context.Database.BeginTransactionAsync();
    }

    public async Task CommitAsync()
    {
        if (_transaction is not null)
        {
            await _transaction.CommitAsync();
            await _transaction.DisposeAsync();
            _transaction = null;
        }
    }

    public async Task RollbackAsync()
    {
        if (_transaction is not null)
        {
            await _transaction.RollbackAsync();
            await _transaction.DisposeAsync();
            _transaction = null;
        }
    }
}