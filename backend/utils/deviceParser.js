import { UAParser } from 'ua-parser-js'
import geoip from 'geoip-lite'

/**
 * Parse device information from user agent string
 * @param {string} userAgent - User agent string from request
 * @param {string|null} customDeviceName - Optional custom device name from client
 * @returns {object} Device information object
 */
export const parseDeviceInfo = (userAgent, customDeviceName = null) => {
  const parser = new UAParser(userAgent)
  const result = parser.getResult()
  
  // Determine device type
  let deviceType = 'desktop'
  if (result.device.type === 'mobile') deviceType = 'mobile'
  else if (result.device.type === 'tablet') deviceType = 'tablet'
  else if (result.device.type) deviceType = result.device.type
  
  // Auto-generate device name if not provided
  let deviceName = customDeviceName
  if (!deviceName) {
    const browser = result.browser.name || 'Unknown Browser'
    const os = result.os.name || 'Unknown OS'
    const device = result.device.model || ''
    
    if (device) {
      deviceName = `${device} (${browser})`
    } else {
      deviceName = `${browser} on ${os}`
    }
  }
  
  return {
    deviceName,
    deviceType,
    browser: result.browser.name || 'Unknown',
    os: result.os.name || 'Unknown',
    userAgent
  }
}

/**
 * Extract client IP address from request
 * @param {object} req - Express request object
 * @returns {string} IP address
 */
export const getClientIp = (req) => {
  // Check various headers in order of priority
  const forwarded = req.headers['x-forwarded-for']
  if (forwarded) {
    // x-forwarded-for can be a comma-separated list
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

/**
 * Get location information from IP address
 * @param {string} ipAddress - IP address
 * @returns {object|null} Location information or null if not found
 */
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

/**
 * Check if login is suspicious based on device and location
 * @param {object} currentDevice - Current device info
 * @param {string} currentIp - Current IP address
 * @param {array} previousSessions - Previous user sessions
 * @returns {object} { isSuspicious: boolean, reason: string }
 */
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

