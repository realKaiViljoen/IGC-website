export type ClientCredential = {
  uid: string
  email: string
  hashedPassword: string
  contactName: string
}

// To add a new client:
// 1. node -e "const b = require('bcryptjs'); console.log(b.hashSync('their-password', 10))"
// 2. Add entry below with their uid, email, hash, and name
export const clients: ClientCredential[] = [
  {
    uid: "igc-demo-001",
    email: "sarah@aperture.com",
    hashedPassword: "$2b$10$lnLTe1YDZ0v8KhUOj1lEfOGy0puh7tnLpxFlcJdMfxVo8rVX3NSt2",
    contactName: "Sarah Lowe",
  },
]
