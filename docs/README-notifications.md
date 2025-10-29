# Notification Component

A comprehensive notification dropdown component with infinite scroll, mark as read functionality, and attractive design that follows the application's theme.

## Features

✅ **Scalable Design**: Clean, modern interface that adapts to the application theme
✅ **Infinite Scroll**: Automatically loads more notifications as user scrolls
✅ **Mark as Read**: Hover over unread notifications to show mark as read button
✅ **Badge Count**: Shows unread notification count with smart formatting (99+)
✅ **Real-time Updates**: Refreshes unread count every 30 seconds
✅ **Responsive**: Works on mobile and desktop
✅ **Loading States**: Skeleton loading and error handling
✅ **Custom Hook**: Reusable notification logic

## Usage

### Basic Implementation

```jsx
import Notification from './shared/ui/header/components/notification';

// Replace the old notification component in header
<Notification />
```

### With Demo Data

```jsx
import NotificationDemo from './shared/ui/header/components/notification-demo';

// For testing/demo purposes
<NotificationDemo />
```

## API Integration

The component expects the following API endpoints:

### GET /notifications/
**Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)

**Response:**
```json
{
  "count": 50,
  "next": "http://api.example.com/notifications/?page=3",
  "previous": "http://api.example.com/notifications/?page=1",
  "results": [
    {
      "id": 1,
      "title": "New invoice created",
      "message": "Invoice #INV-001 has been generated",
      "type": "invoice",
      "is_read": false,
      "created_at": "2023-10-07T10:30:00Z",
      "action_url": "/invoices/1"
    }
  ]
}
```

### PATCH /notifications/{id}/mark-read/
Marks a single notification as read.

### PATCH /notifications/mark-all-read/
Marks all notifications as read.

### GET /notifications/unread-count/
**Response:**
```json
{
  "count": 5
}
```

## Notification Types

The component supports different notification types with appropriate icons:

- `invoice` - 💰 (Invoice related)
- `quote` - 📋 (Quote related) 
- `project` - 📁 (Project related)
- `task` - ✅ (Task related)
- `payment` - 💳 (Payment related)
- `client` - 👤 (Client related)
- `system` - ⚙️ (System notifications)
- `reminder` - ⏰ (Reminders)
- `default` - 🔔 (Fallback)

## Styling

The component uses CSS modules with theme-consistent colors:

- **Primary Colors**: `--Primary-600 (#1570EF)`, `--Primary-50 (#EFF8FF)`
- **Gray Scale**: `--Gray-900` to `--Gray-50`
- **Interactive States**: Hover effects, loading animations
- **Responsive**: Mobile-first design

## Theme Integration

Colors follow the existing application theme:
- Primary blue: `#1570EF` 
- Background: White with subtle gray borders
- Text: Dark gray hierarchy
- Interactive elements: Primary blue with hover states

## Performance

- **Infinite Scroll**: Uses Intersection Observer API
- **React Query**: Efficient caching and background updates
- **Pagination**: Loads 20 notifications per page
- **Optimistic Updates**: Immediate UI feedback for mark as read

## Mobile Support

- Responsive width (340px on mobile)
- Touch-friendly tap targets
- Optimized font sizes
- Condensed spacing on small screens

## Error Handling

- Network error recovery
- Retry functionality
- Loading skeletons
- Empty states

## Accessibility

- Proper ARIA labels
- Keyboard navigation support
- Screen reader friendly
- Color contrast compliance

## File Structure

```
src/
├── APIs/
│   └── notification-api.js          # API functions
├── shared/
│   ├── hooks/
│   │   └── use-notifications.js     # Custom hook
│   └── ui/header/components/
│       ├── notification.jsx         # Main component
│       ├── notification-demo.jsx    # Demo with mock data
│       └── notification.module.scss # Component styles
```

## Future Enhancements

- [ ] WebSocket integration for real-time notifications
- [ ] Push notification support
- [ ] Notification categories/filtering
- [ ] Archive/delete functionality
- [ ] Notification preferences
- [ ] Sound notifications
- [ ] Desktop notifications API integration

## Development Notes

- Uses React Query for state management
- Custom hook for reusable logic
- CSS modules for scoped styling
- Intersection Observer for infinite scroll
- Date-fns for date formatting
- React Bootstrap for dropdown component