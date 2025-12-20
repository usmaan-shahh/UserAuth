export class DuplicateUserError extends Error {
    constructor() {
        super('Username already exists')
        this.name = 'DuplicateUserError'
        this.statusCode = 409
    }
}

export class InvalidCredentialsError extends Error {
    constructor() {
        super('Invalid username or password')
        this.name = 'InvalidCredentialsError'
        this.statusCode = 401
    }
}
