<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\MechanicProfile;

class NewMechanicProfileNotification extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
 public function __construct(
        public MechanicProfile $profile
    ) {
    }

    public function via(object $notifiable): array
    {
        return ['database'];
    }
    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->line('The introduction to the notification.')
            ->action('Notification Action', url('/'))
            ->line('Thank you for using our application!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
     public function toArray(object $notifiable): array
    {
        return [
            'title' => 'New Mechanic Certification Request',

            'message' => sprintf(
                '%s has created a mechanic profile and is waiting for certification.',
                $this->profile->user?->name ?? 'A new mechanic'
            ),

            'type' => 'mechanic_certification_request',

            'action_url' => '/admin/mechanics',

            'mechanic_id' => $this->profile->user_id,

            'mechanic_profile_id' => $this->profile->id,
        ];
    }
}
