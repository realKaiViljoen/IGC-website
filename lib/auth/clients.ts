export type ClientCredential = {
  uid: string
  email: string
  hashedPassword: string
  contactName: string
}

// To add a new client:
// 1. node -e "const b = require('bcryptjs'); console.log(b.hashSync('their-password', 10))"
// 2. Add entry below with their uid, email, hash, and name
//
// Demo accounts (Phase 0):
//   - james@meridian.network / password123  (MSP — default)
//   - thandi@vantagetech.co.za / password123 (recruitment)
export const clients: ClientCredential[] = [
  {
    uid: "igc-msp-demo-001",
    email: "james@meridian.network",
    hashedPassword: "$2b$10$SQxoqErAZwC6YUa2nqk7IOxqFVZwOccBqmExeQbNb/jyBl9JMNDiK",
    contactName: "James Carter",
  },
  {
    uid: "igc-demo-001",
    email: "thandi@vantagetech.co.za",
    hashedPassword: "$2b$10$SQxoqErAZwC6YUa2nqk7IOxqFVZwOccBqmExeQbNb/jyBl9JMNDiK",
    contactName: "Thandi Nkosi",
  },
]
