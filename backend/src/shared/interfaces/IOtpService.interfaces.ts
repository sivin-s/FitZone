export interface IOtpService{
    generateOtp():string
    storeOtp(
        email: string,
        otp: string
    ):Promise<void>,
    getOtp(
        email: string
    ):Promise<string | null>,
    deleteOtp(
        email: string
    ): Promise<void>
}