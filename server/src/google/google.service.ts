import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
require("dotenv").config();

const CLIEND_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
const FOLDER_ID = process.env.FOLDER_ID;

@Injectable()
export class GoogleService {
    private readonly drive: any;

    constructor(){
        const oath2Client = new google.auth.OAuth2(CLIEND_ID, CLIENT_SECRET, REDIRECT_URI);
        oath2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

        this.drive = google.drive({
            version: "v3",
            auth: oath2Client
        });
    };

    async setFilePublic(fileId: string){
        try {
            await this.drive.permissions.create({
                fileId: fileId,
                requestBody: {
                    role: 'reader',
                    type: 'anyone'
                }
            });
        } catch (error) {
            console.log(error);
        }
    }

    async uploadFile(file: any){
        try {
            const now = new Date();
            const name = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}T${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}.${now.getMilliseconds().toString().padStart(3, '0')}Z`;
            const createFile = await this.drive.files.create({
                requestBody: {
                    name: name,
                    mimeType: "video/mp4",
                    parents: [FOLDER_ID]
                },
                media: {
                    mimeType: "video/mp4",
                    body: require("fs").createReadStream(file.path)
                },
                fields: 'id'
            });
            const fileId = createFile.data.id;
            await this.setFilePublic(fileId);
            return fileId;
        } catch(error) {
            console.log(error);
            return '';
        }
    }

}
