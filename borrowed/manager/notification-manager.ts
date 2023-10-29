import { toast } from 'react-hot-toast'

export enum NotificationType {
  success = 'success',
  error = 'error',
  default = 'default'
}

class NotificationManager {
  static addNotification(
    title: any,
    message: any,
    type = NotificationType.default,
    duration = 4000
  ) {
    if (type === NotificationType.default) {
      toast(message, {
        duration,
        icon: '👏'
      })
    } else {
      toast[type](message, {
        duration
      })
    }
  }
}

export default NotificationManager
