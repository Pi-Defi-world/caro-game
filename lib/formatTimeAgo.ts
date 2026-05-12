
export function formatTimeAgo(dateString: string | Date): string {
    const date = dateString instanceof Date ? dateString : new Date(dateString)
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInSecs = Math.floor(diffInMs / 1000)
    const diffInMins = Math.floor(diffInSecs / 60)
    const diffInHours = Math.floor(diffInMins / 60)
    const diffInDays = Math.floor(diffInHours / 24)
    const diffInMonths = Math.floor(diffInDays / 30)
    const diffInYears = Math.floor(diffInMonths / 12)
  
    if (diffInSecs < 60) {
      return `${diffInSecs} ${diffInSecs === 1 ?"s":"s"} ago`
    } else if (diffInMins < 60) {
      return `${diffInMins} ${diffInMins === 1 ?"m":"m"} ago`
    } else if (diffInHours < 24) {
      return `${diffInHours} ${diffInHours === 1 ?"h":"h"} ago`
    } else if (diffInDays < 30) {
      return `${diffInDays} ${diffInDays === 1 ?"d":"d"} ago`
    } else if (diffInMonths < 12) {
      return `${diffInMonths} ${diffInMonths === 1 ?"m":"m"} ago`
    } else {
      return `${diffInYears} ${diffInYears === 1 ?"y":"y"} ago`
    }
  }
  
  