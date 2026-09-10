<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
     public function index(Request $request)
    {
        $user = $request->user();

        $notifications = $user->notifications()
            ->latest()
            ->limit(20)
            ->get();

        return response()->json([
            'notifications' => $notifications,
            'unread_count' => $user->unreadNotifications()->count(),
        ]);
    }

    public function markAsRead(
        Request $request,
        string $notification
    ) {
        $user = $request->user();

        $user->notifications()
            ->where('id', $notification)
            ->firstOrFail()
            ->markAsRead();

        return response()->json([
            'message' => 'Notification marked as read.',
        ]);
    }

    public function markAllAsRead(Request $request)
    {
        $user = $request->user();

        $user->unreadNotifications->markAsRead();

        return response()->json([
            'message' => 'All notifications marked as read.',
        ]);
    }

    public function destroy(
        Request $request,
        string $notification
    ) {
        $user = $request->user();

        $user->notifications()
            ->where('id', $notification)
            ->firstOrFail()
            ->delete();

        return response()->json([
            'message' => 'Notification deleted.',
        ]);
    }
}
