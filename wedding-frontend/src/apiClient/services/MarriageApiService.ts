/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Guest } from '../models/Guest';
import type { GuestDto } from '../models/GuestDto';
import type { RSVP } from '../models/RSVP';
import type { Wedding } from '../models/Wedding';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class MarriageApiService {

    /**
     * @returns any Success
     * @throws ApiError
     */
    public static getWedding(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/wedding',
        });
    }

    /**
     * @param requestBody 
     * @returns any Success
     * @throws ApiError
     */
    public static postWedding(
requestBody: Wedding,
): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/wedding',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @returns any Success
     * @throws ApiError
     */
    public static getGuests(): CancelablePromise<any> {
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
requestBody: GuestDto,
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
     * @returns any Success
     * @throws ApiError
     */
    public static getGuests1(
id: number,
): CancelablePromise<any> {
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
requestBody: Guest,
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
     * @returns any Success
     * @throws ApiError
     */
    public static getGuestsRsvp(
rsvpCode: string,
): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/guests/rsvp/{rsvpCode}',
            path: {
                'rsvpCode': rsvpCode,
            },
        });
    }

    /**
     * @param requestBody 
     * @returns any Success
     * @throws ApiError
     */
    public static postRsvp(
requestBody: RSVP,
): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/rsvp',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

}
