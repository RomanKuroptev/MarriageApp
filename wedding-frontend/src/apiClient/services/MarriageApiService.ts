/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateGuestDto } from '../models/CreateGuestDto';
import type { Guest } from '../models/Guest';
import type { LoginRequest } from '../models/LoginRequest';
import type { UpdateGuestDto } from '../models/UpdateGuestDto';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class MarriageApiService {

    /**
     * @param requestBody 
     * @returns any Success
     * @throws ApiError
     */
    public static postLogin(
requestBody: LoginRequest,
): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/login',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @returns Guest Success
     * @throws ApiError
     */
    public static getGuests(): CancelablePromise<Array<Guest>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/guests',
        });
    }

    /**
     * @param requestBody 
     * @returns any Success
     * @throws ApiError
     */
    public static postGuests(
requestBody: CreateGuestDto,
): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/guests',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @param id 
     * @returns Guest Success
     * @throws ApiError
     */
    public static getGuests1(
id: number,
): CancelablePromise<Guest> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/guests/{id}',
            path: {
                'id': id,
            },
        });
    }

    /**
     * @param id 
     * @param requestBody 
     * @returns any Success
     * @throws ApiError
     */
    public static putGuests(
id: number,
requestBody: UpdateGuestDto,
): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/guests/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @param id 
     * @returns any Success
     * @throws ApiError
     */
    public static deleteGuests(
id: number,
): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/guests/{id}',
            path: {
                'id': id,
            },
        });
    }

    /**
     * @param rsvpCode 
     * @returns Guest Success
     * @throws ApiError
     */
    public static getGuestsRsvp(
rsvpCode: string,
): CancelablePromise<Guest> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/guests/rsvp/{rsvpCode}',
            path: {
                'rsvpCode': rsvpCode,
            },
        });
    }

    /**
     * @param email 
     * @returns Guest Success
     * @throws ApiError
     */
    public static getGuestsEmail(
email: string,
): CancelablePromise<Guest> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/guests/email/{email}',
            path: {
                'email': email,
            },
        });
    }

}
