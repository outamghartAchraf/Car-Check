<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class MechanicCertificationNotification extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
     public function __construct(
        public string $status
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
        $isCertified = $this->status === 'certified';

        return [
            'title' => $isCertified
                ? 'Mechanic Account Certified'
                : 'Mechanic Certification Rejected',

            'message' => $isCertified
                ? 'Your mechanic account has been certified. You can now accept inspection requests.'
                : 'Your mechanic certification has been rejected by an administrator.',

            'type' => 'mechanic_certification',

            'action_url' => '/mechanic/profile',

            'certification_status' => $this->status,
        ];
    }
}
