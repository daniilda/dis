namespace DocIndex.Api.Application.Domain.Entities;

public abstract class Entity<TId> : IEntity where TId : notnull
{
    object IEntity.Id => Id;

    public TId Id { get; }

    protected Entity(TId id)
        => Id = id;

    public virtual bool Equals(Entity<TId>? entity)
    {
        if (entity is null)
            return false;

        return Id.Equals(entity.Id) &&
               GetType() == entity.GetType();
    }

    public override int GetHashCode()
        => HashCode.Combine(Id, GetType());

    public override bool Equals(object? obj)
        => obj is Entity<TId> entity &&
           Equals(entity);
}
