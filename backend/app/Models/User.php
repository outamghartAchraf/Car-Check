<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function isClient(): bool
    {
        return $this->role === 'client';
    }

    public function isMechanic(): bool
    {
        return $this->role === 'mechanic';
    }

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function vehicles()
    {
        return $this->hasMany(Vehicle::class);
    }

    public function inspectionRequests()
    {
        return $this->hasMany(
            InspectionRequest::class,
            'client_id'
        );
    }

    public function mechanicInspectionRequests()
    {
        return $this->hasMany(
            InspectionRequest::class,
            'mechanic_id'
        );
    }

    public function mechanicProfile()
    {
        return $this->hasOne(MechanicProfile::class);
    }

    public function clientAppointments()
    {
        return $this->hasMany(Appointment::class, 'client_id');
    }

    public function mechanicAppointments()
    {
        return $this->hasMany(Appointment::class, 'mechanic_id');
    }

    public function mechanicAvailabilities()
    {
        return $this->hasMany(MechanicAvailability::class, 'mechanic_id');
    }
}
