import AWS from 'aws-sdk';
import crypto from 'crypto'
import dotenv from 'dotenv';
dotenv.config()

export default class Cognito {
    private config = {
        apiVersion: '2022-01-01',
        region: 'ap-southeast-1',
    }

    private secretHash = ''
    private clientId = '';

    private cognitoIdentity: AWS.CognitoIdentityServiceProvider;

    private hashSecret(username: string): string {
        return crypto.createHmac('SHA256', this.secretHash)
            .update(username + this.clientId)
            .digest('base64')
    }

    constructor() {
        this.cognitoIdentity = new AWS.CognitoIdentityServiceProvider(this.config)
    }

    public async resgister(username: string, password: string, userAttr: Array<any>): Promise<AWS.CognitoIdentityServiceProvider.SignUpResponse> {
        var params = {
            ClientId: this.clientId,
            Password: password,
            Username: username,
            SecretHash: this.hashSecret(username),
            UserAttributes: userAttr,
        }
        try {
            const result = await this.cognitoIdentity.signUp(params).promise()
            return result
        } catch (error: AWS.CognitoIdentityServiceProvider.SignUpResponse | any) {
            return error
        }
    }

    public async login(username: string, password: string): Promise<boolean> {
        var params = {
            AuthFlow: 'USER_PASSWORD_AUTH', /* required */
            ClientId: this.clientId, /* required */
            AuthParameters: {
                'USERNAME': username,
                'PASSWORD': password,
                'SECRET_HASH': this.hashSecret(username)
            },
        }

        try {
            let data = await this.cognitoIdentity.initiateAuth(params).promise();
            console.log(data);
            return true;
        } catch (error) {
            console.log(error)
            return false;
        }
    }

    public async confirmRegister(username: string, code: string): Promise<boolean> {
        var params = {
            ClientId: this.clientId,
            ConfirmationCode: code,
            Username: username,
            SecretHash: this.hashSecret(username),
        };

        try {
            const cognitoResp = await this.cognitoIdentity.confirmSignUp(params).promise();
            console.log(cognitoResp)
            return true
        } catch (error) {
            console.log("error", error)
            return false
        }
    }

    public async forgotPassword(username: string): Promise<boolean> {
        var params = {
            ClientId: this.clientId, /* required */
            Username: username, /* required */
            SecretHash: this.hashSecret(username),
        }

        try {
            const data = await this.cognitoIdentity.forgotPassword(params).promise();
            console.log(data);
            return true
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    public async confirmNewPassword(username: string, password: string, code: string): Promise<boolean> {
        var params = {
            ClientId: this.clientId, /* required */
            ConfirmationCode: code, /* required */
            Password: password, /* required */
            Username: username, /* required */
            SecretHash: this.hashSecret(username),
        };

        try {
            const data = await this.cognitoIdentity.confirmForgotPassword(params).promise();
            console.log(data);
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }
}