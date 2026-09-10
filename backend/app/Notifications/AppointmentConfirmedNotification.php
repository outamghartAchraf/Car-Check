<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\Appointment;

class AppointmentConfirmedNotification extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(
        public Appointment $appointment
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
            'title' => 'Appointment Confirmed',
            'message' => sprintf(
                'A new inspection appointment has been scheduled for %s at %s.',
                $this->appointment->appointment_date->format('M d, Y'),
                date('H:i', strtotime($this->appointment->start_time))
            ),
            'type' => 'appointment_confirmed',
            'action_url' => '/mechanic/appointments',
            'appointment_id' => $this->appointment->id,
        ];
    }
}
