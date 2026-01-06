import { UAParser } from 'ua-parser-js'
import geoip from 'geoip-lite'

export const parseDeviceInfo = (userAgent, customDeviceName = null) => {

  const parser = new UAParser(userAgent)
  const ua = parser.getResult() // Returns an object with the parsed user agent data like browser, os, device, etc.
  
  
  let deviceType = 'desktop'; //  if ua.device?.type is undefined it means it's a desktop device
  if (ua.device?.type) {
    deviceType = ua.device.type;
  }
  

  let deviceName = customDeviceName
  if (!deviceName) {

    const browser = ua.browser?.name || 'Unknown Browser'
    const os = ua.os?.name || 'Unknown Operating System'
    const device = ua.device?.model || ''
     
    if (device) {
      deviceName = `${device} (${browser})`
    } else {
      deviceName = `${browser} on ${os}`
    }
  }
  
  return {
    deviceName,
    deviceType,
    browser: ua.browser.name || 'Unknown',
    os: ua.os.name || 'Unknown',
    userAgent
  }
}

//extract client IP address from request  
export const getClientIp = (req) => {
  
  const forwarded = req.headers['x-forwarded-for']
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  
  return (
    req.headers['x-real-ip'] ||
    req.connection?.remoteAddress ||
    req.socket?.remoteAddress ||
    req.ip ||
    'unknown'
  )
}

//fetch location details (country, region, city, timezone) from ip address
export const getLocationFromIp = (ipAddress) => {

  // Skip for local/private IPs
  if (!ipAddress || ipAddress === 'unknown' || 
      ipAddress.startsWith('127.') || 
      ipAddress.startsWith('192.168.') ||
      ipAddress.startsWith('10.') ||
      ipAddress === '::1' ||
      ipAddress === '::ffff:127.0.0.1') {
      return null
  }
  
  // Clean IPv6-mapped IPv4 addresses
  let cleanIp = ipAddress
  if (ipAddress.startsWith('::ffff:')) {
    cleanIp = ipAddress.substring(7)
  }
  
  const geo = geoip.lookup(cleanIp)
  
  if (!geo) return null
  
  return {
    country: geo.country,
    region: geo.region,
    city: geo.city,
    timezone: geo.timezone
  }
}

//check if login is suspicious based on device and location
export const detectSuspiciousActivity = (currentDevice, currentIp, previousSessions) => {
  if (!previousSessions || previousSessions.length === 0) {
    // First login is not suspicious
    return { isSuspicious: false, reason: null }
  }
  
  const currentLocation = getLocationFromIp(currentIp)
  
  // Check for new device type
  const hasUsedDeviceType = previousSessions.some(
    session => session.deviceInfo?.deviceType === currentDevice.deviceType
  )
  
  // Check for new location
  let hasUsedLocation = true
  if (currentLocation) {
    hasUsedLocation = previousSessions.some(session => 
      session.location?.country === currentLocation.country
    )
  }
  
  // Check for new browser
  const hasUsedBrowser = previousSessions.some(
    session => session.deviceInfo?.browser === currentDevice.browser
  )
  
  // Determine if suspicious
  const reasons = []
  
  if (!hasUsedDeviceType) {
    reasons.push('new device type')
  }
  
  if (!hasUsedLocation && currentLocation) {
    reasons.push(`new location (${currentLocation.country})`)
  }
  
  if (!hasUsedBrowser) {
    reasons.push('new browser')
  }
  
  // Consider it suspicious if 2 or more new factors
  const isSuspicious = reasons.length >= 2
  
  return {
    isSuspicious,
    reason: isSuspicious ? reasons.join(', ') : null
  }
}

